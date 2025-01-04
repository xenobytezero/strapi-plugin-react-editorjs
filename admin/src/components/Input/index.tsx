import { useState, useCallback, useEffect, FC, useMemo } from 'react';
import ReactEditorJS from '@react-editor-js/client'
import EditorJS, { EditorConfig, OutputData } from '@editorjs/editorjs'
import { FetchError, FieldValue, InputProps, useAuth, useFetchClient, useField, useStrapiApp } from '@strapi/strapi/admin'
import { Typography as Typ, EmptyStateLayout, Flex, Loader, Field, Box, BoxComponent } from '@strapi/design-system';
import styled from 'styled-components';
// import Typography from 'typography'

import pluginId from '../../pluginId';
// import MediaLibComponent, { FormattedFile } from '../medialib/component';
// import { changeFunc } from '../medialib/utils';

import type { ToolMap, StrapiEditorJS, ToolpackModule, MediaLibResultCallback } from '../../../../types/Toolpack';
import type { GET_ToolpackValid } from '../../../../types/Endpoints';
import type { Schema } from '@strapi/strapi';
import MediaLibComponent from '../medialib/component';

// --------------------------------------

export type MediaLibraryDialogProps = Partial<{
    allowedTypes: Schema.Attribute.MediaKind[];
    onClose: () => void;
    onSelectAssets: (_images: Schema.Attribute.MediaValue<true>) => void;
}>

// --------------------------------------
// --------------------------------------

type ActualEditorProps = {
    tools: ToolMap
    onChange: (output: OutputData) => void
    onAPIReady: (api: EditorJS) => void
}

const ActualEditor: FC<ActualEditorProps> = ({ tools, onAPIReady, onChange }) => {
    return <ReactEditorJS
        onChange={(api, ev) => {
            api.saver.save().then(output => {
                onChange(output)
            });
        }}
        tools={tools}
        onInitialize={editor => {
            const api = editor.dangerouslyLowLevelInstance as EditorJS
            api.isReady.then(() => {
                onAPIReady(api);
            })

        }}
    />
}

// --------------------------------------
// --------------------------------------


type EditorProps = InputProps & FieldValue;

const Editor: FC<EditorProps> = ({
    name,
    hint,
    required,
    disabled,
    label,
    labelAction
}) => {


    const field = useField<OutputData>(name);
    const fetchClient = useFetchClient();
    const { token } = useAuth('EditorJSEditor', (auth) => auth);

    const [editorInstance, setEditorInstance] = useState<EditorJS | null>(null);
    const [toolpackModule, setToolpackModule] = useState<ToolpackModule | null>(null);
    const [tools, setTools] = useState<ToolMap | null>(null);
    const [toolpackError, setToolpackError] = useState<string | null>(null);

    const [isMediaLibOpen, setMediaLibOpen] = useState<boolean>(false);
    const [onMediaLibResult, setOnMediaLibResult] = useState<MediaLibResultCallback | null>(null)

    const ejsToolpackObject = useMemo<StrapiEditorJS>(() => ({
        pluginEndpoint: `${process.env.STRAPI_ADMIN_BACKEND_URL}/${pluginId}`,
        authToken: token,
        fetchClient,
        mediaLib: {
            open: (callback) => {
                setOnMediaLibResult(() => callback);
                setMediaLibOpen(true);
            }
        }
    }), [])


    useEffect(() => {

        // check if the toolpack on the server is valid
        fetchClient.get<GET_ToolpackValid>(
            `${process.env.STRAPI_ADMIN_BACKEND_URL}${pluginId}/toolpackValid`
        )
            .then((resp) => {
                // if it's valid, load the toolpack
                return import(/* @vite-ignore */`${process.env.STRAPI_ADMIN_BACKEND_URL}${pluginId}/toolpack`);
            })
            .then(module => {
                setToolpackModule(module);
            })
            .catch((err: FetchError) => {
                setToolpackError(err.message);
            })

    }, [])

    useEffect(() => {
        // we need the module
        if (toolpackModule === null) { return; }

        try {
            const toolCreator = toolpackModule.createTools;
            const tls = toolCreator(ejsToolpackObject);
            setTools(tls);
        } catch (err) {
            const msg = err instanceof Error ? err.message : JSON.stringify(err);
            setToolpackError(`Failed to hydrate toolpack tools - ${msg}`);
        }

    }, [toolpackModule])

    const onEditorChanged = (output: OutputData) => {
        if (!output.blocks.length) {
            field.onChange(name, undefined);
        } else {
            field.onChange(name, output);
        }
    }

    function hasInitialData(initialData: OutputData | undefined): initialData is OutputData {
        return initialData !== undefined && initialData.blocks.length > 0
    }

    const onEditorAPIReady = (api: EditorJS) => {

        setEditorInstance(api);

        const initialData = hasInitialData(field.initialValue) ? field.initialValue as OutputData : null;

        if (toolpackModule !== null && toolpackModule.customiseInstance !== undefined) {
            toolpackModule.customiseInstance(api, initialData);
        }

        if (hasInitialData(field.initialValue)) {
            api.render(field.initialValue)
        }

    }

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
            return <ActualEditor
                tools={tools}
                onAPIReady={onEditorAPIReady}
                onChange={onEditorChanged}
            ></ActualEditor>
        }
    }

    return <Field.Root name={name} hint={hint} error={field.error} required={required}>
        <Flex direction="column" alignItems="stretch" gap={1}>
            <Field.Label action={labelAction}>{label}</Field.Label>
            <EditorWrapper>
                <EditorStyle>
                    {renderEditor()}
                </EditorStyle>
            </EditorWrapper>
            {isMediaLibOpen && <MediaLibComponent
                onClose={() => {
                    setOnMediaLibResult(null);
                    setMediaLibOpen(false);
                }}
                onChange={(data) => {
                    if (onMediaLibResult) {
                        onMediaLibResult(data)
                    }
                    setOnMediaLibResult(null);
                    setMediaLibOpen(false);
                }}
            />}
            <Field.Hint />
            <Field.Error />
        </Flex>
    </Field.Root>

};

// --------------------------------------
// --------------------------------------

const EditorWrapper = styled<BoxComponent>(Box)`
    border: 1px solid black;
    border-color: ${(props) => props.theme.colors.neutral200};
    border-radius: ${props => props.theme.borderRadius};
    padding: ${props => props.theme.spaces[4]};
`;

// --------------------------------------
// --------------------------------------

// This sucks, would be really nice if there was a way to
// apply the same stylesheet as used in the blocks
// editor

const EditorStyle = styled.div`

    font-size:${({ theme }) => theme.fontSizes[2]};
    line-height: ${({ theme }) => theme.lineHeights[4]};

    h1 {
        font-size: 4.2rem;
        line-height: ${({ theme }) => theme.lineHeights[1]};
    }

    h2 {
        font-size: 3.5rem;
        line-height: ${({ theme }) => theme.lineHeights[1]};
    }

    h3 {
        font-size: 2.9rem;
        line-height: ${({ theme }) => theme.lineHeights[1]};
    }

    h4 {
        font-size: 2.4rem;
        line-height: ${({ theme }) => theme.lineHeights[1]};
    }

    h5 {
        font-size: 2rem;
        line-height: ${({ theme }) => theme.lineHeights[1]};
    }

    h6 {
        font-size: 1.6rem;
        line-height: ${({ theme }) => theme.lineHeights[1]};
    }
`;

// --------------------------------------
// --------------------------------------


export default Editor;