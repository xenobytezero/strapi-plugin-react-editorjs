import type {AxiosRequestConfig, AxiosResponse} from 'axios';
import type { BlockToolConstructable, ToolSettings } from "@editorjs/editorjs"
import type EditorJS from '@editorjs/editorjs';

export type StrapiEditorJS = {
    pluginEndpoint: string,
    authToken: string,
    fetchClient: {
        get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
        put<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>; 
        post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
        del<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    }
    mediaLib: {
        toggle: (blockIndex: number) => void
    },
    initialData: any
}

export type ToolMap = {
    [toolName: string]: BlockToolConstructable | ToolSettings;
}

export type CreateToolsFunction = (ejs: StrapiEditorJS) => ToolMap;

export type InstanceCustomFunction = (ejsInstance: EditorJS, initialData: unknown) => void;