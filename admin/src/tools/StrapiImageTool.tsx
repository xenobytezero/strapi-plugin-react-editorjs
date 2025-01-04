import { createRoot, Root } from 'react-dom/client';
import * as React from 'react';
import { StrapiImageComponent } from '../components/StrapiImageComponent';

import type { API, BlockAPI, BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';
import type { StrapiEditorJS, FormattedFile } from '@xenobytezero/strapi-plugin-react-editorjs/types/Toolpack';
import type { MenuConfig, MenuConfigItem } from '@editorjs/editorjs/types/tools';

const MUSIC_ICON = '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M20 3v14a4 4 0 1 1-2-3.465V6H9v11a4 4 0 1 1-2-3.465V3h13z"></path></g></svg>'

// --------------------------------

export type StrapiImageToolDataFilled = {
    /**
     * Caption for the image.
     */
    caption: string;

    /**
     * Flag indicating whether the image has a border.
     */
    withBorder: boolean;

    /**
     * Flag indicating whether the image has a background.
     */
    withBackground: boolean;

    /**
     * Flag indicating whether the image is stretched.
     */
    stretched: boolean;

    /**
     * Object containing the URL of the image file.
     * Also can contain any additional data.
     */
    file: FormattedFile;
}

export type StrapiImageToolData = {} | StrapiImageToolDataFilled

export function isToolDataPresent(data: StrapiImageToolData): data is StrapiImageToolDataFilled {
    return (data as StrapiImageToolDataFilled).file !== undefined
}

// --------------------------------

export type StrapiImageToolConfig = {
    ejs: StrapiEditorJS
}

// --------------------------------

export class StrapiImageTool implements BlockTool {

    private _data: StrapiImageToolData;
    private _blockApi: BlockAPI;
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
            icon: MUSIC_ICON
        };
    }

    constructor({ data, api, block, config }: BlockToolConstructorOptions<StrapiImageToolData, StrapiImageToolConfig>) {
        this._api = api;
        this._blockApi = block as BlockAPI;
        this._data = data;
        this._config = config;
    }

    render() {
        this.update();
        return this._root as HTMLDivElement;
    }

    save() {
        return this._data;
    }

    renderSettings(): HTMLElement | MenuConfig {

        return [
            {
                title: 'Stretch Image'
            },
            {
                title: 'Align Left'
            },
            {
                title: 'Center'
            },
            {
                title: 'Align Right'
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
                    this._blockApi.dispatchChange();
                }}

            ></StrapiImageComponent>
        )

    }


}