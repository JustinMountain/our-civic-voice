import { Pool } from 'pg';

async function connectAndSetupDatabase() {
  const pool = new Pool({
    user: 'automations',
    host: '192.168.1.245',
    database: 'connections',
    password: 'password',
    port: 5432, // default PostgreSQL port
  });


  try {
    const client = await pool.connect();

    
    console.log('Database connection successful!');



    // await client.query(`DROP TABLE IF EXISTS users`);

    // Create a new user table
    // await client.query(`
    //   CREATE ROLE automations WITH LOGIN PASSWORD 'automate';
    // `);


    // await client.query(`DROP TABLE IF EXISTS users`);

    // await client.query(`
    //   GRANT SELECT, INSERT, UPDATE, DELETE ON users2 TO automations;
    // `);


    console.log('Terminating connection');

    // Release the client back to the pool
    client.release();

  } catch (error) {
    console.error(error);
  }

}

connectAndSetupDatabase();


// On DB Setup: https://levelup.gitconnected.com/creating-and-filling-a-postgres-db-with-docker-compose-e1607f6f882f

  // Setup Login/Group Role for automated actions
    // CREATE ROLE and give PERMISSIONS
      // CREATE ROLE automations WITH LOGIN PASSWORD 'automate';
      // GRANT SELECT, INSERT, UPDATE, DELETE ON <schema> TO automations;

  // Setup Tables for info 

// On function call (on setup then nightly?)

  // As automations user, query online source and download file
    // If file is indentical to one already stored, exit
    // If file is new/different, loop over and insert/update rows


// Ontario MPP Info
// https://www.ola.org/sites/default/files/node-files/office_csvs/offices-all.csv

