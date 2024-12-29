import ogs from 'open-graph-scraper';
import type { Context } from 'koa';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { LocalFileData } from 'get-file-object-from-local-path';
import pluginId from '../../../admin/src/pluginId';

// ---------------------------

import type { Core } from '@strapi/strapi';
import type { Config } from '../../../types/Config';
import type { GET_ToolpackValid } from '../../../types/Endpoints';
import type { ToolpackService } from '../services/toolpack';

// ---------------------------

export const DEFAULT_TOOLPACK_PACKAGE = '@xenobytezero/editorjs-default-toolpack';

// -------------------------------------------------

export class EditorJSController {

    // ---------------------------

    constructor(private _strapi: Core.Strapi, private _config: Config) { }

    // ---------------------------

    async link(ctx: Context) {
        const result = await new Promise((resolve) => {

            ogs(ctx.query, (_error, results) => {

                const imageUrl = (results.ogImage && results.ogImage.url) ? { url: results.ogImage.url } : undefined;

                resolve({
                    success: 1,
                    meta: {
                        title: results.ogTitle,
                        description: results.ogDescription,
                        image: imageUrl,
                    },
                })
            })
        });

        ctx.send(result);
    }

    // ---------------------------

    async byFile(ctx: Context) {
        try {

            const { files } = ctx.request.files

            const [uploadedFile] = await strapi.plugin('upload').service('upload').upload({
                data: {},
                files: Object.values(files)
            })

            ctx.send({
                success: 1,
                file: uploadedFile
            })
        } catch (e) {
            ctx.send({
                success: 0,
                message: e.message
            }, 500)
        }
    }

    // ---------------------------

    async byURL(ctx: Context) {
        try {
            const { url } = ctx.request.body;
            const { name, ext } = path.parse(url)
            const filePath = `./public/${name}${ext}`

            const response = await axios.get(url, { responseType: 'arraybuffer' })
            const buffer = Buffer.from(response.data, 'binary')

            await fs.promises.writeFile(filePath, buffer)

            const fileData = new LocalFileData(filePath)

            const file = {
                path: filePath,
                name: fileData.name,
                type: fileData.type,
                size: Buffer.byteLength(buffer),
            }

            const [uploadedFile] = await strapi.plugin('upload').service('upload').upload({
                data: {},
                files: file
            })

            await fs.promises.unlink(filePath);

            ctx.send({
                success: 1,
                file: uploadedFile
            })
        } catch (e) {
            ctx.send({
                success: 0,
                message: e.message
            }, 500)
        }
    }

    // ---------------------------

    async serveToolpack(ctx: Context) {

        const toolpackService = strapi.plugin(pluginId).service('toolpack');
        const toolpackPackageName = toolpackService.getToolpackPackageName();

        // try and load from the config package
        let toolpackFilePath = toolpackService.tryLoadFromPackage(toolpackPackageName);

        // if it has failed, and it wasn't the default, try the default
        if (toolpackFilePath === undefined && toolpackPackageName !== DEFAULT_TOOLPACK_PACKAGE) {
            toolpackFilePath = toolpackService.tryLoadFromPackage(DEFAULT_TOOLPACK_PACKAGE);
        }

        // if it has still failed, log and return an error
        if (toolpackFilePath === undefined) {
            ctx.response.status = 400;
            return;
        }

        // otherwise send the toolpack file
        const fileStream = fs.createReadStream(toolpackFilePath)
        ctx.response.body = fileStream;
        ctx.response.type = 'js';
        return;
    }

    // ---------------------------

    async checkToolpackValid(ctx: Context) {

        const toolpackService = strapi.plugin(pluginId).service<ToolpackService>('toolpack');
        const toolpackPackageName = toolpackService.getToolpackPackageName();

        const ret = toolpackService.packageIsValid(toolpackPackageName);

        if (ret.valid) {
            ctx.response.status = 200;
        } else {
            ctx.response.status = 400;
            ctx.response.body = {
                error: {
                    message: ret.reason
                }
            } as GET_ToolpackValid
        }

    }

    // ---------------------------

    async config(ctx: Context) {
        ctx.response.body = this._config;
    }

}

// -------------------------------------------------
// -------------------------------------------------
// -------------------------------------------------

export default ({ strapi }: { strapi: Core.Strapi }) => {
    const config = strapi.config.get<Config>(`plugin.${pluginId}`);
    return new EditorJSController(strapi, config);
};

