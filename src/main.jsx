import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import './index.css';
import '@fontsource/poppins';
import '@fontsource/urbanist';
import '@fontsource/manrope';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
