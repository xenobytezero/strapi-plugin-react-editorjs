import pluginPkg from '../../package.json';
import Wysiwyg from './components/Wysiwyg';
import pluginId from './pluginId';

import type { StrapiApp } from '@strapi/strapi/admin';

export default {
    register(app: StrapiApp) {
        // executes as soon as the plugin is loaded
        const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;

        app.registerPlugin({
            id: pluginId,
            initializer: () => null,
            isReady: true,
            name: pluginPkg.strapi.name
        });

        app.addFields({ type: 'wysiwyg', Component: Wysiwyg });
    }
};
