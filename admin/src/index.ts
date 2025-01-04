import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import { PluginIcon } from './components/PluginIcon';

import type { StrapiApp } from '@strapi/strapi/admin';
//import Editor from './components/Input';

export default {
    register(app: StrapiApp) {

        app.registerPlugin({
            id: pluginId,
            name: pluginPkg.strapi.name
        });

        app.customFields.register({
            name: "editorjs",
            pluginId,
            type: "json",
            icon: PluginIcon,
            components: {
                Input: async () => import("./components/Input") as any
            },
            intlLabel: {
                id: `${pluginId}.color.label`,
                defaultMessage: "EditorJS Editor",
            },
            intlDescription: {
                id: `${pluginId}.color.description`,
                defaultMessage: "Edit text content with EditorJS",
            },
        })

        // app.addFields({
        //     type: 'wysiwyg',
        //     Component: Editor as React.FC<unknown>,
        // });

    }
};
