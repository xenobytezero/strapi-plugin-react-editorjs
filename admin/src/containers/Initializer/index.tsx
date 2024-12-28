/**
 *
 * Initializer
 *
 */

import React, { useEffect, useRef } from 'react';
import pluginId from '../../pluginId';

type InitializerProps = {
    setPlugin: (id: string) => void;
};

const Initializer: React.FC<InitializerProps> = ({ setPlugin }) => {
    type setPluginFunc = (id: string) => void

    const ref = useRef<setPluginFunc | null>(null);
    ref.current = setPlugin;

    useEffect(() => {
        if (ref.current !== null) {
            ref.current(pluginId);
        }
    }, []);

    return null;
};

export default Initializer;
