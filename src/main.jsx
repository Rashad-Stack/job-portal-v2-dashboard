<<<<<<< HEAD
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
=======
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Router from "./router/router"; 

import './index.css';
import '@fontsource/poppins';
import '@fontsource/urbanist';
import '@fontsource/manrope';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router /> 
  </StrictMode>
);
>>>>>>> 9c9bcb7381188a4f71b4f93d8351d62aba394816
