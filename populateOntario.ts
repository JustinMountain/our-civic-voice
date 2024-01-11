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
    console.log('Ensuring ontario_mpps and ontario_mpp_offices tables are empty...');
    await client.query(`DELETE FROM ontario_mpps`);
    await client.query(`DELETE FROM ontario_mpp_offices`);

    console.log('Successfully emptied ontario_mpps and ontario_mpp_offices tables!');

    // This is where I do stuff with the records and the DB
    const subarray = records.slice(1, 2); 

    for (const record of subarray) {
      const query_mpp = {
        text: `INSERT INTO ontario_mpps (
          member_id, 
          riding_name, 
          parliamentary_role, 
          party, 
          first_name, 
          last_name, 
          honorific, 
          updated_date) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        values: [
          record[17], // member_id
          record[14], // riding_name
          record[16], // parliamentary_role
          record[15], // party
          record[1], // first_name
          record[2], // last_name
          record[0], // honorific
        ],
      };

      const query_mpp_offices = {
        text: `INSERT INTO ontario_mpp_offices (
          member_id,
          office_type,
          address,
          city,
          province,
          postal_code,
          office_email,
          email,
          telephone,
          fax,
          toll_free,
          tty,
          updated_date) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())`,
        values: [
          record[17], // member_id
          record[3], // office_type
          record[4], // address
          record[5], // city
          record[6], // province
          record[7], // postal_code
          record[8], // office_email
          record[9], // email
          record[10], // telephone
          record[11], // fax
          record[12], // toll_free
          record[13], // tty
        ],
      };

      try {
        await client.query(query_mpp);
        await client.query(query_mpp_offices);
      } catch (err) {
        console.error(err);
        // handle error appropriately
      }
    }

    // Release the client back to the pool
    client.release();

  } catch (error) {
    console.error(error);
  }

}

// Below is the call to run this program
runProgram();
