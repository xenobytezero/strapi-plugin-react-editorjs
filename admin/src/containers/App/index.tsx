/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import { Route, Routes } from 'react-router-dom';
import { Page } from '@strapi/strapi/admin';

const App = () => {
    return (
        <Routes>
            <Route path="*" element={<Page.Error />} />
        </Routes>
    );
};

export default App;
