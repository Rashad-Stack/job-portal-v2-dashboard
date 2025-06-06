import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import './index.css';
import '@fontsource/poppins';
import '@fontsource/urbanist';
import '@fontsource/manrope';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <App />
    </AuthProvider>
);
