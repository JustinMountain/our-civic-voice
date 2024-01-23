import { Pool } from 'pg';

const pool = new Pool({
  user: 'automations',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'our_civic_voice',
  password: process.env.DB_PASSWORD || 'password',
  port: 5432, // default PostgreSQL port
});

pool.on('error', (error) => {
  console.error('Unexpected error on idle client', error);
  process.exit(-1);
});

export default pool;
