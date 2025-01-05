import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
    build: {
        outDir: '../dist-tools',
        lib: {
            entry: [
                // Config Helpers
                resolve(__dirname, 'config/index.ts'),
                // Strapi Custom Image Tool
                resolve(__dirname, 'tools/StrapiImageTool.tsx'),
            ],
            formats: ['es']
        },
        rollupOptions: {
            external: ["react", "react-dom", '@strapi/strapi', '@strapi/strapi/admin', '@strapi/design-system', '@strapi/icons']
        },
        sourcemap: true
    },
    define: {
        'process.env': process.env
    },
    plugins: [
        dts(),
        cssInjectedByJsPlugin({
            styleId: "strapiejs-strapi-image"
        })
    ]
})
