import { useState, useCallback, useEffect } from 'react';
import { createReactEditorJS } from 'react-editor-js'
import EditorJS, { EditorConfig, OutputData } from '@editorjs/editorjs'
import { FieldValue, useAuth, useFetchClient } from '@strapi/strapi/admin'
import { Typography as Typ, EmptyStateLayout, Flex, Loader } from '@strapi/design-system';

import pluginId from '../../pluginId';
import MediaLibComponent, { FormattedFile } from '../medialib/component';
import { changeFunc } from '../medialib/utils';

import { ToolMap, type StrapiEditorJS, type ToolpackModule } from '../../../../types/Toolpack';

const EditorJs = createReactEditorJS();

export type EditorProps = {
    field: FieldValue
    name: string
    disabled?: boolean
}

export const Editor = ({ field, name }: EditorProps) => {

    const fetchClient = useFetchClient();
    const { token } = useAuth('EditorJSEditor', (auth) => auth);

    const [editorInstance, setEditorInstance] = useState<EditorJS>();
    const [mediaLibBlockIndex, setMediaLibBlockIndex] = useState<number>(-1);
    const [isMediaLibOpen, setIsMediaLibOpen] = useState<boolean>(false);

    const [toolpackModule, setToolpackModule] = useState<ToolpackModule | null>(null);

    const [tools, setTools] = useState<ToolMap | null>(null);

    const [toolpackError, setToolpackError] = useState<string | null>(null);

    const createEjsObject: () => StrapiEditorJS = () => {
        const ejs = {
            pluginEndpoint: `${process.env.STRAPI_ADMIN_BACKEND_URL}/${pluginId}`,
            authToken: token,
            fetchClient,
            // mediaLib: {
            //     toggle: mediaLibToggleFunc
            // }
        }
        return ejs;
    }

    useEffect(() => {
        // check if the toolpack on the server is valid

        fetchClient.get(
            `${process.env.STRAPI_ADMIN_BACKEND_UR}/${pluginId}/toolpackValid`,
            // we want to check the response rather than just throw
            { validateStatus: () => true }
        )
            .then((resp) => {

                // if it's valid, load the toolpack
                if (resp.status === 200) {
                    return import(/*webpackIgnore: true*/`${process.env.STRAPI_ADMIN_BACKEND_UR}/${pluginId}/toolpack`);

                    // if it's not valid, the reason is in the body
                } else if (resp.status === 400) {
                    throw new Error(resp.data)

                    // for something unexpected, then throw an unexpected error
                } else {
                    throw new Error('Unexpected Error.');
                }
            })
            .then(module => {
                setToolpackModule(module);
            })
            .catch((err) => {
                setToolpackError(err.message);
            })

    }, [])

    useEffect(() => {
        // we need the module
        if (toolpackModule === null) { return; }

        try {
            const toolCreator = toolpackModule.createTools;
            const tls = toolCreator(createEjsObject());
            setTools(tls);
        } catch (err) {
            const msg = err instanceof Error ? err.message : JSON.stringify(err);
            setToolpackError(`Failed to hydrate toolpack tools - ${msg}`);
        }

    }, [toolpackModule])

    // const mediaLibToggleFunc = useCallback(getToggleFunc({
    //     openStateSetter: setIsMediaLibOpen,
    //     indexStateSetter: setMediaLibBlockIndex
    // }), []);

    const handleMediaLibChange = useCallback((data: FormattedFile[]) => {

        if (editorInstance === undefined) {
            return;
        }

        changeFunc({
            indexStateSetter: setMediaLibBlockIndex,
            data,
            index: mediaLibBlockIndex,
            editor: editorInstance
        });
        //mediaLibToggleFunc();




    }, [mediaLibBlockIndex, editorInstance]);

    const renderEditor = () => {

        if (toolpackError !== null) {
            return <>
                <EmptyStateLayout
                    content="Failed to load Toolpack"
                    action={<Typ textAlign="center" variant="pi">{toolpackError}</Typ>}
                />
            </>
        } else if (tools === null) {
            return <>
                <Flex alignItems='center' justifyContent='center' direction='column' paddingTop={6} paddingBottom={6}>
                    <Loader small />
                    <Typ variant="epsilon">Loading Toolpack...</Typ>
                </Flex>
            </>
        } else {
            return <ActualEditor></ActualEditor>
        }

    }

    const ActualEditor: React.FC = () => {

        if (tools === null) {
            return <EmptyStateLayout
                content="Toolpack not set in EditorJS component"
            />
        }

        return <EditorJs
            onChange={(api, ev) => {
                api.saver.save().then(newData => {
                    if (!newData.blocks.length) {
                        field.onChange(name, null);
                    } else {
                        field.onChange(name, JSON.stringify(newData));
                    }
                });
            }}
            tools={tools}
            onInitialize={editor => {
                const api = editor.dangerouslyLowLevelInstance as EditorJS

                setEditorInstance(api);

                const hasInitialData = field.initialValue && JSON.parse(field.initialValue).blocks.length > 0;
                const initialData = hasInitialData ? JSON.parse(field.initialValue) : null;

                if (toolpackModule !== null && toolpackModule.customiseInstance !== undefined) {
                    toolpackModule.customiseInstance(api, initialData);
                }

                if (hasInitialData) {
                    api.render(initialData)
                }


            }}
        />
    }



    return (
        <>
            <div style={{ border: `1px solid rgb(227, 233, 243)`, borderRadius: `2px`, marginTop: `4px` }}>
                {renderEditor()}
            </div>
            <MediaLibComponent
                isOpen={isMediaLibOpen}
                onChange={handleMediaLibChange}
                onToggle={() => { }}
            />
        </>
    );
};