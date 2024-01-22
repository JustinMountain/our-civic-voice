import pool from '../../config/databasePool';
import { findCSVFiles } from '../../config/csvUtilities';
import { processCSVtoMemory } from '../../config/populationUtilities';
import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../config/constants';

const federalMemberInfoDirectory = './database/federal/csv-sources/member-info/';

/**
 * Populates the federal_mps table with the data from the CSV files.
 * @returns Whether the tables were successfully populated..
 */
export async function populateFederalMemberTable(): Promise<Boolean> {
  let recentFileName: string = '';
  let data: string[][] = [];

  console.log(`Retrieving data from ${federalMemberInfoDirectory}...`);
  try {
    const allFileNames = await findCSVFiles(federalMemberInfoDirectory);
    recentFileName = allFileNames[0];
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not find CSV file. ${CONSOLE_RESET}`);
    throw error;
  }

  if (recentFileName !== '') {
    try {
      data = await processCSVtoMemory(`${federalMemberInfoDirectory}/${recentFileName}`);  
    } catch (error) {
      console.error(`${CONSOLE_ERROR}Could not process CSV file. ${CONSOLE_RESET}`);
      throw error;
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
    console.log(`${CONSOLE_HIGHLIGHT}Successfully inserted all Federal Member Contact info!${CONSOLE_RESET}`);
    client.release();
    return true;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Received database error. ${CONSOLE_RESET}`);
    throw error;
  }
}