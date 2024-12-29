import { Box, Field, Typography as Typ, Flex } from '@strapi/design-system';
import { useField, type InputProps } from '@strapi/admin/strapi-admin';

import { Editor } from "../editorjs";
import type { Schema } from '@strapi/strapi';
import type { FC } from 'react';

export interface WysiwygProps extends Omit<InputProps, 'type'> {
    labelAction?: React.ReactNode;
    type: Schema.Attribute.RichText['type'];
}

const Wysiwyg: FC<WysiwygProps> = ({
    name,
    hint,
    required,
    disabled,
    label,
    labelAction
}) => {

    const field = useField(name);

    return <Field.Root name={name} hint={hint} error={field.error} required={required}>
        <Flex direction="column" alignItems="stretch" gap={1}>
            <Field.Label action={labelAction}>{label}</Field.Label>
            <Editor field={field} name={name} disabled={disabled} />
            <Field.Hint />
            <Field.Error />
        </Flex>
    </Field.Root>
};

export default Wysiwyg