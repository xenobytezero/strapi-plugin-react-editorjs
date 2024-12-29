export interface File {
    id: number;
    name: string;
    alternativeText?: string | null;
    caption?: string | null;
    width?: number | null;
    height?: number | null;
    formats?: Record<string, FileFormat> | {
        thumbnail: {
            url: string;
        };
    } | null;
    hash: string;
    ext?: string;
    mime?: string;
    size?: number;
    sizeInBytes?: number;
    url?: string;
    previewUrl?: string | null;
    path?: string | null;
    provider?: string;
    provider_metadata?: Record<string, unknown> | null;
    isUrlSigned?: boolean;
    folder?: number | string | null;
    folderPath?: string;
    related?: {
        id: string | number;
        __type: string;
        __pivot: {
            field: string;
        };
    }[];
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    publishedAt?: string;
    updatedBy?: number;
    isLocal?: boolean;
}

type FileFormat = {
    name: string;
    hash: string;
    ext: string;
    mime: string;
    path: null | string;
    width: number;
    height: number;
    size: number;
    sizeInBytes: number;
    url: string;
};