import { Pool } from 'pg';
import { parse } from 'csv-parse';
import fs from 'fs';

const results: any[] = [];


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

    // Remove all rows from DB for testing purposes
    await client.query(`DELETE FROM ontario_mpp`);
    await client.query(`DELETE FROM ontario_mpp_offices`);

    console.log('Content removed from ontario_mpp and ontario_mpp_offices!');

    // Download file from remote and check if it is the same
      // TODO


  } catch (error) {
    console.error(error);
  }

}

// connectAndSetupDatabase();

const filePath = './db_sources/ontario/offices-all.csv';


const processOntario = async () => {
  const records: string[][] = [];
  const parser = fs.createReadStream(filePath)
    .pipe(parse({ delimiter: ",", from_line: 1, relax_column_count: true }));

  for await (const record of parser) {
    records.push(record);
  }
  return records;
};

processOntario()
  .then(records => {
    console.log(records[0]);
    console.log(records[1]);
  })
  .catch(error => {
    console.error('Error:', error);
  });
    




// From the empty DB, I need to check the headers for expected values
// If expected, loop over CSV data to populate DB


// Ontario MPP Info
// https://www.ola.org/sites/default/files/node-files/office_csvs/offices-all.csv

