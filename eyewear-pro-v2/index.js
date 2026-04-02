// index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App.jsx'; // Assurez-vous que le nom de fichier est correct

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
// src/index.js
import pool from './db.js';

async function testDB() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('DB connected:', res.rows[0]);
  } catch (err) {
    console.error('DB error:', err);
  }
}

testDB();
