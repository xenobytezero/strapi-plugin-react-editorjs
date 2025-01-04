import { FC } from 'react';
import { useStrapiApp } from '@strapi/strapi/admin';
import { Schema } from '@strapi/strapi';
import type { File } from '../../../../types/Strapi';
import type { FormattedFile } from '../../../../types/Toolpack';

// ---------------------

export type MediaLibComponentProps = {
    onChange: (files: FormattedFile[]) => void,
    onClose: () => void
}

type MediaLibraryDialogProps = Partial<{
    allowedTypes: Schema.Attribute.MediaKind[];
    onClose: () => void;
    onSelectAssets: (_images: Schema.Attribute.MediaValue<true>) => void;
}>

// ---------------------

const MediaLibComponent: FC<MediaLibComponentProps> = ({ onChange, onClose }) => {

    const components = useStrapiApp('MediaLibComponent', (state) => state.components);
    const MediaLibraryDialog = components['media-library'] as React.FC<MediaLibraryDialogProps>

    const handleSelectAssets = (files: File[]) => {
        const formattedFiles = files.map(f => ({
            alt: f.alternativeText || f.name,
            url: f.url,
            width: f.width,
            height: f.height,
            size: f.size,
            mime: f.mime,
            formats: f.formats
        })) as FormattedFile[]


        onChange(formattedFiles);
    };

    return (
        <MediaLibraryDialog
            allowedTypes={['images']}
            onClose={onClose}
            onSelectAssets={handleSelectAssets}
        />
    );

};

export default MediaLibComponent;

// ---------------------
