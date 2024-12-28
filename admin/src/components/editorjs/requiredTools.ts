import PluginId from '../../pluginId'

import { useAuth, useFetchClient } from '@strapi/strapi/admin'

// Plugins for Editor.js
import Image from '@editorjs/image'

const { token } = useAuth('EditorJSUploader', (auth) => auth);

const requiredTools = {
    image: {
        class: Image,
        config: {
            field: "files.image",
            additionalRequestData: {
                data: JSON.stringify({})
            },
            additionalRequestHeaders: {
                "Authorization": `Bearer ${token}`
            },
            endpoints: {
                byUrl: `${process.env.STRAPI_ADMIN_BACKEND_URL}/${PluginId}/image/byUrl`,
            },
            uploader: {
                async uploadByFile(file: File) {

                    const { post } = useFetchClient();

                    const formData = new FormData();
                    formData.append("data", JSON.stringify({}));
                    formData.append("files.image", file);

                    const { data, status } = await post(`${process.env.STRAPI_ADMIN_BACKEND_URL}/${PluginId}/image/byFile`, formData, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    return data
                },
            }
        }
    }
}

export default requiredTools
