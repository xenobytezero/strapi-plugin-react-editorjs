import pluginPkg from '../../package.json';

export default pluginPkg.name.replace(
    /^((?:@.*?\/)?strapi-plugin-react-)/i,
    ''
);
