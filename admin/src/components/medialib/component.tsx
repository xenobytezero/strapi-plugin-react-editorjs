import { FC } from 'react';
import { useStrapiApp } from '@strapi/strapi/admin';
import { Schema } from '@strapi/strapi';
import { type File } from '../../../../types/Strapi';

// ---------------------

export type MediaLibComponentProps = {
    isOpen: boolean,
    onChange: (files: FormattedFile[]) => void,
    onToggle: () => void
}

export type FormattedFile = Pick<File, 'width' | 'height' | 'size' | 'mime' | 'formats'> & {
    url: string
    alt: string
}

export type MediaLibraryDialogProps = Partial<{
    allowedTypes: Schema.Attribute.MediaKind[];
    onClose: () => void;
    onSelectAssets: (_images: Schema.Attribute.MediaValue<true>) => void;
}>

// ---------------------

const MediaLibComponent: FC<MediaLibComponentProps> = ({ isOpen, onChange, onToggle }) => {

    const components = useStrapiApp('MediaLibComponent', (state) => state.components);
    const MediaLibraryDialog = components['media-library'] as React.FC<MediaLibraryDialogProps>

    const handleSelectAssets = (files: File[]) => {
        const formattedFiles = files.map(f => ({
            alt: f.alternativeText || f.name,
            url: `${process.env.STRAPI_ADMIN_BACKEND_URL}/${f.url}`,
            width: f.width,
            height: f.height,
            size: f.size,
            mime: f.mime,
            formats: f.formats
        })) as FormattedFile[]


        onChange(formattedFiles);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <MediaLibraryDialog
            allowedTypes={['images']}
            onClose={() => onToggle}
            onSelectAssets={handleSelectAssets}
        />
    );

};

export default MediaLibComponent;

// ---------------------
