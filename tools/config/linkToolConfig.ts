import type { StrapiEditorJS } from "@xenobytezero/strapi-plugin-react-editorjs/types/Toolpack";

// -----------------------------------------------------

export function createStrapiLinkToolConfig(ejs: StrapiEditorJS) {
    return {
        endpoint: `${ejs.pluginEndpoint}/link`,
        headers: {
            "Authorization": `Bearer ${ejs.authToken}`
        }
    }
}