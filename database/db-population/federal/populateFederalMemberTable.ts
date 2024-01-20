import pool from '../databasePool';
import { findCSVFiles } from '../../csv-sources/csvUtilities';
import { processCSVtoMemory } from '../populationUtilities';

// From Memory to DB
export async function populateFederalMemberTable(directory: string): Promise<Boolean> {
  let recentFileName: string = '';
  let data: string[][] = [];

  console.log(`Retrieving data from ${directory}...`);
  try {
    const allFileNames = await findCSVFiles(directory);
    recentFileName = allFileNames[0];
  } catch (error) {
    console.log('Could not find CSV file:')
    console.error(error);
    return false;
  }

  if (recentFileName !== '') {
    try {
      data = await processCSVtoMemory(`${directory}/${recentFileName}`);  
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
      // Query to insert a new entry for ontario_mpps PK riding_name
      const insert_mp = {
        text: `INSERT INTO federal_mps (
          honorific,
          first_name,
          last_name,
          constituency,
          province_territory,
          party,
          active_from,
          updated_date) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        values: [
          record[0],
          record[1],
          record[2],
          record[3],
          record[4],
          record[5],
          record[6],
          new Date(parseInt(record[7])),
        ],
      };
      await client.query(insert_mp);
    }
    console.log('Successfully inserted all Federal Member info!\n');
    client.release();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
