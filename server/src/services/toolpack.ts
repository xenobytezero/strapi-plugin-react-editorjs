import fs from 'node:fs';

import pluginId from '../../../admin/src/pluginId';

import type { Core } from '@strapi/strapi';
import type { Config } from '../../../types/Config';

// -------------------------------------------------
// -------------------------------------------------
// -------------------------------------------------

export class ToolpackService {

    // -------------------------------------------------

    constructor(private _strapi: Core.Strapi, private _config: Config) { }

    // -------------------------------------------------

    getToolpackPackageName() {
        return this._config.toolpack;
    }

    resolvePackage(packageName: string): string {
        // start resolution from the Strapi root rather than the plugin
        // this should correctly resolve to whatever the entrypoint of the
        // package is
        let packagePath;
        try {
            packagePath = require.resolve(packageName, {
                paths: [process.cwd()]
            });
        } catch (err) {
            throw new Error(`Could not find package ${packageName}, check it is installed properly.`);
        }

        if (!fs.existsSync(packagePath)) {
            throw new Error(`Failed to find entrypoint ${packagePath}' in package ${packageName}`)
        }
        return packagePath
    }

    packageIsValid(packageName: string) {
        try {
            this.resolvePackage(packageName);
            return {
                valid: true,
                reason: undefined
            }
        } catch (err) {
            return {
                valid: false,
                reason: err.message
            }
        }
    }

    tryLoadFromPackage(packageName: string): string | undefined {
        try {
            return this.resolvePackage(packageName);
        } catch (err) {
            console.error(`Failed to load Toolpack from package ${packageName}`);
            console.error(`Reason - ${err.message}`);
            return undefined;
        }
    }



}

// -------------------------------------------------
// -------------------------------------------------
// -------------------------------------------------


export default ({ strapi }: { strapi: Core.Strapi }) => {
    const config = strapi.config.get(`plugin.${pluginId}`);
    const service = new ToolpackService(strapi, config);
    return service;
}