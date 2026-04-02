// main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // ton CSS global
import './scroll-fix.css'; // CSS pour corriger le scroll
import './i18n'; // Initialisation de i18n

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
