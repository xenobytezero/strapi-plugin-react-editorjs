import type { ToolConstructable, ToolSettings } from "@editorjs/editorjs"
import type EditorJS from '@editorjs/editorjs';
import type { getFetchClient } from '@strapi/strapi/admin'

export type FetchClient = ReturnType<typeof getFetchClient>

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