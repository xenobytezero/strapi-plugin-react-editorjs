import type { ToolConstructable, ToolSettings } from "@editorjs/editorjs"
import type EditorJS from '@editorjs/editorjs';
import type { getFetchClient, StrapiAppContextValue } from '@strapi/strapi/admin'
import type { File } from './Strapi';

export type FormattedFile = Pick<File, 'width' | 'height' | 'size' | 'mime' | 'formats'> & {
    url: string
    alt: string
}

export type FetchClient = ReturnType<typeof getFetchClient>

export type MediaLibResultCallback = (data: FormattedFile[]) => void

export type StrapiEditorJS = {
    pluginEndpoint: string,
    authToken: string | null,
    fetchClient: FetchClient
    initialData?: unknown,
    mediaLib: {
        open: (callback: MediaLibResultCallback) => void
    }
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