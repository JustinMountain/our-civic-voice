import pool from '../databasePool';
import { findCSVFiles } from '../../csv-sources/csvUtilities';
import { processCSVtoMemory } from '../populationUtilities';

export async function populateOntarioMemberTables(directory: string): Promise<Boolean> {
  let recentFileName: string = '';
  let data: string[][] = [];

  console.log(`Retrieving data from ${directory}...`);
  try {
    const allFileNames = await findCSVFiles(directory);
    console.log(allFileNames);
    recentFileName = allFileNames[0];
    console.log(recentFileName);

  } catch (error) {
    console.log('Could not find CSV file:')
    console.error(error);
    return false;
  }

  if (recentFileName !== '') {
    try {
      data = await processCSVtoMemory(`${directory}${recentFileName}`);  
    } catch (error) {
      console.log('Could not process CSV file:');
      console.error(error);
      return false;
    }
  }

  console.log('Connecting to the database...');
  try {
    const client = await pool.connect();
    const arrayHeaders = data.shift();

    console.log('Attempting to insert records...');
    for (const record of data) {
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
      const res = await client.query(existsQuery);
      const exists = res.rows[0].exists;

      if (!exists) {
        await client.query(insert_mpp);
      }

      await client.query(insert_mpp_offices);
    }

    console.log('Successfully inserted all Ontario Member info!\n');
    client.release();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
