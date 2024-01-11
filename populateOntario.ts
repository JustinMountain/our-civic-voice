import { Pool } from 'pg';
import { parse } from 'csv-parse';
import fs from 'fs';

const filePath = './db_sources/ontario/offices-all.csv';

function runProgram() {
  processOntarioCSV(filePath)
  .then(records => {
    populateOntarioTables(records);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// Takes the csv file and converst it into an array
async function processOntarioCSV(filePath: string) {
  const records: string[][] = [];
  const parser = fs.createReadStream(filePath)
    .pipe(parse({ delimiter: ",", from_line: 1, relax_column_count: true }));

  for await (const record of parser) {
    records.push(record);
  }
  return records;
};

// Takes the array and 
async function populateOntarioTables(records: string[][]) {
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
    console.log('Ensuring ontario_mpp and ontario_mpp_offices tables are empty...');
    await client.query(`DELETE FROM ontario_mpp`);
    await client.query(`DELETE FROM ontario_mpp_offices`);

    console.log('Successfully emptied ontario_mpp and ontario_mpp_offices tables!');


    // This is where I do stuff with the records and the DB
    console.log(records[0][1]);
    console.log(records[1][1]);

    // Release the client back to the pool
    client.release();

  } catch (error) {
    console.error(error);
  }

}

// Below is the call to run this program
runProgram();
