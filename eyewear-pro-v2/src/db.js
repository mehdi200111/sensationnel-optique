import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD); // ça doit être une string
console.log("DB_HOST:", process.env.DB_HOST);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: false,
});

export default pool;
