import { Pool } from 'pg';

const pool = new Pool({
  user: 'automations',
  host: '192.168.1.245',
  database: 'connections',
  password: 'password',
  port: 5432, // default PostgreSQL port
});

pool.on('error', (error) => {
  console.error('Unexpected error on idle client', error);
  process.exit(-1);
});

export default pool;
