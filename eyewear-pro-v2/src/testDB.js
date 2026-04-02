import pool from './db.js';

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database is connected! Current time:', res.rows[0]);
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    pool.end(); // ferme la connexion
  }
}

testConnection();
