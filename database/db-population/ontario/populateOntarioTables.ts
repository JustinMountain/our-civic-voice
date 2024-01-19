import pool from '../databasePool';
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
async function processOntarioCSV(filePath: string): Promise<string[][]> {
  const records: string[][] = [];
  const parser = fs.createReadStream(filePath)
    .pipe(parse({ delimiter: ",", from_line: 1, relax_column_count: true }));

  for await (const record of parser) {
    records.push(record);
  }
  return records;
};

// Takes the array and 
export async function populateOntarioTables(records: string[][]): Promise<Boolean> {

  try {
    const client = await pool.connect();

    console.log('Database connection successful!');

    // Remove all rows from DB for testing purposes
    console.log('Ensuring ontario_mpps and ontario_mpp_offices tables are empty...');
    await client.query(`DELETE FROM ontario_mpp_offices`);
    await client.query(`DELETE FROM ontario_mpps`);
    console.log('Successfully emptied ontario_mpps and ontario_mpp_offices tables!\n');

    // Removes the header from the index 0
    const arrayHeaders = records.shift();

    console.log('Populating the ontario_mpps and ontario_mpp_offices tables...');

    // Loops over the array to create records for each item
    for (const record of records) {
      // Handle when member_id is not a number
      let memID: number = 0;
      if (parseInt(record[17], 10)) {
        memID = parseInt(record[17], 10);
      }

      // Query to see if entry exists for ontario_mpps PK riding_name
      const existsQuery = {
        text: 'SELECT EXISTS(SELECT 1 FROM ontario_mpps WHERE riding_name = $1)',
        values: [
          record[14], // riding_name
        ],
      };

      // Query to insert a new entry for ontario_mpps PK riding_name
      const insert_mpp = {
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
          memID, // member_id
          record[14], // riding_name
          record[16], // parliamentary_role
          record[15], // party
          record[1], // first_name
          record[2], // last_name
          record[0], // honorific
        ],
      };

      // Query to insert a new entry for ontario_mpp_offices FK riding_name
      const insert_mpp_offices = {
        text: `INSERT INTO ontario_mpp_offices (
          riding_name, 
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
          record[14], // riding_name
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

      // Attempt queries above
      try {
        const res = await client.query(existsQuery);
        const exists = res.rows[0].exists;

        if (!exists) {
          await client.query(insert_mpp);
        }

        await client.query(insert_mpp_offices);
      } catch (err) {
        console.error(err);
      }
    }

    console.log('Completed population of ontario_mpps and ontario_mpp_offices tables!\n');

    // Release the client back to the pool
    client.release();

    return true;
  } catch (error) {
    console.error(error);
  }
  return false;

}

// Below is the call to run this program
runProgram();


// Here we just need to read the CSV and populate the database
