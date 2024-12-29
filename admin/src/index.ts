import pluginPkg from '../../package.json';
import Wysiwyg, { type WysiwygProps } from './components/Wysiwyg';
import pluginId from './pluginId';
import { PluginIcon } from './components/PluginIcon';

import type { StrapiApp } from '@strapi/strapi/admin';

export default {
    register(app: StrapiApp) {

        app.addFields({
            type: 'wysiwyg',
            Component: Wysiwyg as React.FC<Partial<WysiwygProps>>,
        });


        app.customFields.register({
            name: "editorjs",
            pluginId,
            type: "json",
            icon: PluginIcon,
            components: {
                Input: () => import("./components/Wysiwyg") as any
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


        app.registerPlugin({
            id: pluginId,
            name: pluginPkg.strapi.name
        });

    }
};
