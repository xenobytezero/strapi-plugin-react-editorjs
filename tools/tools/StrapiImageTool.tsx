import { createRoot, Root } from 'react-dom/client';
import * as React from 'react';
import { StrapiImageComponent } from '../components/StrapiImageComponent';

import type { API, BlockAPI, BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';
import type { StrapiEditorJS, FormattedFile } from '@xenobytezero/strapi-plugin-react-editorjs/types/Toolpack';
import type { MenuConfig, MenuConfigItem } from '@editorjs/editorjs/types/tools';

import { IconPicture, IconStretch, IconTrash } from '@codexteam/icons'

// --------------------------------

export type StrapiImageToolData = {
    /**
     * Caption for the image.
     */
    caption?: string;

    /**
     * Flag indicating whether the image should be displayed
     * full width.
     */
    fullWidth: boolean;

    /**
     * Object containing the URL of the image file.
     * Also can contain any additional data.
     */
    file?: FormattedFile
}

export type StrapiImageToolDataAny = {} | StrapiImageToolData

export function isToolDataPresent(data: StrapiImageToolDataAny): data is StrapiImageToolData {
    return (data as StrapiImageToolData).file !== undefined
}

// --------------------------------

export type StrapiImageToolConfig = {
    ejs: StrapiEditorJS
}

// --------------------------------

const DEFAULT_TOOL_DATA: StrapiImageToolData = {
    file: undefined,
    caption: undefined,
    fullWidth: false
}

// --------------------------------

export class StrapiImageTool implements BlockTool {

    private _data: StrapiImageToolData;
    private _block: BlockAPI;
    private _config: StrapiImageToolConfig | undefined;
    private _api: API;
    private _root: HTMLDivElement | null = null;
    private _reactRoot: Root | null = null;

    static get enableLineBreaks() {
        return false;
    }

    static get toolbox() {
        return {
            title: 'Strapi Image',
            icon: IconPicture
        };
    }

    constructor({ data, api, block, config }: BlockToolConstructorOptions<StrapiImageToolDataAny, StrapiImageToolConfig>) {
        this._api = api;
        this._block = block;
        this._data = isToolDataPresent(data) ? data : DEFAULT_TOOL_DATA
        this._config = config;
    }

    render() {
        this.update();
        return this._root as HTMLDivElement;
    }

    save() {
        return { ...this._data }
    }

    renderSettings(): HTMLElement | MenuConfig {
        return [
            {
                title: 'Full Width',
                icon: IconStretch,
                toggle: true,
                isActive: () => this._data.fullWidth,
                onActivate: () => {
                    this._data = {
                        ...this._data,
                        fullWidth: !this._data.fullWidth
                    }
                    this.update();
                }
            },
            {
                title: 'Clear Image',
                icon: IconTrash,
                onActivate: () => {
                    this._data = {
                        ...this._data,
                        file: undefined
                    }
                    this.update();
                }
            }
        ] as MenuConfigItem[]

    }

    private update() {

        if (this._reactRoot === null) {
            this._root = document.createElement('div');
            this._reactRoot = createRoot(this._root);
        }

        if (this._config === undefined) {
            this._reactRoot.render(<>
                <span>Tool requires a configuration object</span>
            </>)
            return;
        }


        this._reactRoot.render(
            <StrapiImageComponent
                data={this._data}
                ejsApi={this._api}
                strapiEjs={this._config.ejs}
                onChanged={(newData) => {
                    this._data = newData;
                    this._block.dispatchChange();
                }}

            ></StrapiImageComponent>
        )

    }


}