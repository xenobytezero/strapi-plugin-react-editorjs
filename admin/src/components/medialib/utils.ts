import { FormattedFile } from './component';
import EditorJS from '@editorjs/editorjs'

// -------------------------------------------
// -------------------------------------------
// -------------------------------------------

// export const getToggleFunc = ({ openStateSetter, indexStateSetter }) => {
//     return (idx) => {
//         if (idx || idx === 0) {
//             indexStateSetter(idx);
//         }

//         openStateSetter((prev) => !prev);
//     };
// };

// -------------------------------------------
// -------------------------------------------
// -------------------------------------------

export type ChangeFuncOpts = {
    indexStateSetter: (val: number) => void
    editor: EditorJS
    data: FormattedFile[]
    index: number
}

export const changeFunc = ({ indexStateSetter, editor, data, index }: ChangeFuncOpts) => {
    let insertedBlocksCount = 0;
    data.forEach((entry) => {

        if (!entry.mime?.includes("image")) {
            return;
        }

        const newBlockType = "image";
        const newBlockData = {
            file: {
                url: entry.url.replace(window.location.origin, ""),
                mime: entry.mime,
                height: entry.height,
                width: entry.width,
                size: entry.size,
                alt: entry.alt,
                formats: entry.formats,
            },
            caption: "",
            withBorder: false,
            withBackground: false,
            stretched: false
        };

        editor.blocks.insert(newBlockType, newBlockData, {}, index + insertedBlocksCount, true);
        insertedBlocksCount++;
    })

    editor.blocks.delete(index + insertedBlocksCount);
    indexStateSetter(-1);
};
