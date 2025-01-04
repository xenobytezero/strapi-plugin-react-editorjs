import * as React from 'react';

import { useCallback, useEffect, useState, type FC } from 'react';

import { isToolDataPresent, type StrapiImageToolData } from '../tools/StrapiImageTool';
import type { API } from '@editorjs/editorjs';
import type { MediaLibResultCallback, StrapiEditorJS } from '@xenobytezero/strapi-plugin-react-editorjs/types/Toolpack';

// --------------------------------------------

export type StrapiImageComponentProps = {
    data: StrapiImageToolData,
    ejsApi: API,
    onChanged?: (data: StrapiImageToolData) => void,
    strapiEjs: StrapiEditorJS
}

// --------------------------------------------

export const StrapiImageComponent: FC<StrapiImageComponentProps> = ({ data: inputData, ejsApi, strapiEjs, onChanged }) => {

    const [toolData, setToolData] = useState<Partial<StrapiImageToolData>>(inputData);

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

    // ----------------------

    const onMediaLibOpen = () => {
        strapiEjs.mediaLib.open(mediaLibCallback)
    }

    // ----------------------


    if (!isToolDataPresent(toolData)) {

        return <>
            <button className={ejsApi.styles.button} onClick={onMediaLibOpen}>Select Image...</button>
        </>

    } else {
        return <>
            <img src={toolData.file.url} />
            <button className={ejsApi.styles.button}>Clear</button>
        </>
    }



}