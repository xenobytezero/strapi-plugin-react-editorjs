import * as React from 'react';

import { useCallback, useEffect, useState, type FC } from 'react';

import type { StrapiImageToolData } from '../tools/StrapiImageTool';
import type { API } from '@editorjs/editorjs';
import type { MediaLibResultCallback, StrapiEditorJS } from '@xenobytezero/strapi-plugin-react-editorjs/types/Toolpack';

import classes from './StrapiImageComponent.module.css'

// --------------------------------------------

export type StrapiImageComponentProps = {
    data: StrapiImageToolData,
    ejsApi: API,
    onChanged?: (data: StrapiImageToolData) => void,
    strapiEjs: StrapiEditorJS
}

// --------------------------------------------

export const StrapiImageComponent: FC<StrapiImageComponentProps> = ({ data: inputData, ejsApi, strapiEjs, onChanged }) => {

    const [toolData, setToolData] = useState<StrapiImageToolData>(inputData);

    // ----------------------

    useEffect(() => {
        setToolData(inputData);
    }, [inputData])

    useEffect(() => {
        if (onChanged) { onChanged(toolData) }
    }, [toolData])

    const mediaLibCallback = useCallback<MediaLibResultCallback>((images) => {

        if (images.length === 0) {
            return;
        }

        if (images.length > 1) {
            return;
        }

        setToolData({
            ...toolData,
            file: images[0]
        })


    }, []);

    const updateCaption = useCallback((caption: string) => {
        setToolData({
            ...toolData,
            caption: caption.length > 0 ? caption : undefined
        })
    }, []);

    // ----------------------

    const onMediaLibOpen = () => {
        strapiEjs.mediaLib.open(mediaLibCallback)
    }

    // ----------------------

    const renderSelection = () => {
        return <>
            <button className={ejsApi.styles.button} onClick={onMediaLibOpen}>Select Image...</button>
        </>
    }

    const renderImage = () => {
        return <>
            <img src={toolData.file?.url} />
            <input
                value={toolData.caption}
                className={ejsApi.styles.input}
                placeholder='Enter a caption...'
                onInput={(ev) => updateCaption(ev.currentTarget.value)}
            ></input>
        </>
    }

    return <div className={`${classes.root} ${toolData.fullWidth ? classes.fullWidth : ''}`}>
        {
            toolData.file === undefined ?
                renderSelection() :
                renderImage()
        }

    </div>

}