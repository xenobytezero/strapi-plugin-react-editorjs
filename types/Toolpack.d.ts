import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { BlockToolConstructable, ToolSettings } from "@editorjs/editorjs"
import type EditorJS from '@editorjs/editorjs';
import type { FetchClient } from '@strapi/strapi/admin'

export type StrapiEditorJS = {
    pluginEndpoint: string,
    authToken: string | null,
    fetchClient: FetchClient
    mediaLib?: {
        toggle: (blockIndex: number) => void
    },
    initialData?: unknown
}

export type ToolMap = {
    [toolName: string]: ToolConstructable | ToolSettings;
}

export type ToolpackModule = {
    createTools: CreateToolsFunction
    customiseInstance?: InstanceCustomFunction
}

export type CreateToolsFunction = (ejs: StrapiEditorJS) => ToolMap;

export type InstanceCustomFunction = (ejsInstance: EditorJS, initialData: unknown) => void;