import pool from '../../../config/databasePool';
import { findCSVFiles } from '../../../config/csvUtilities';
import { processCSVtoMemory } from '../../../config/populationUtilities';
import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../../config/constants';
import { FED_MEMBER_INFO_DIRECTORY } from '../../../config/constants';
import { dbQuery } from '../../../config/populationUtilities';

/**
 * Populates the federal_mps table with the data from the saved CSV files.
 * @returns True if successful, otherwise false.
 */
export async function populateFederalMemberTable(): Promise<Boolean> {
  let recentFileName: string = '';
  let data: string[][] = [];

  console.log(`Retrieving data from ${FED_MEMBER_INFO_DIRECTORY}...`);
  try {
    const allFileNames = await findCSVFiles(FED_MEMBER_INFO_DIRECTORY);
    recentFileName = allFileNames[0];
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not find CSV file. ${CONSOLE_RESET}`);
    throw error;
  }

  if (recentFileName !== '') {
    try {
      data = await processCSVtoMemory(`${FED_MEMBER_INFO_DIRECTORY}/${recentFileName}`);  
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
      const mpQuery = createMPQuery(record);
      await client.query(mpQuery);
    }
    console.log(`${CONSOLE_HIGHLIGHT}Successfully inserted all Federal Member Contact info!${CONSOLE_RESET}`);
    client.release();
    return true;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Received database error. ${CONSOLE_RESET}`);
    throw error;
  }
}

/**
 * Creates a database query for inserting a single record into the federal_mps table.
 * @param record A single record representing one Federal MP.
 * @returns A dbQuery object to use with a client connection.
 */
function createMPQuery(record: string[]): dbQuery {
  const mpQuery = {
    text: `INSERT INTO federal_mps (
      member_id,
      honorific,
      first_name,
      last_name,
      constituency,
      province_territory,
      party,
      active_from,
      updated_date,
      source) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
    values: [
      record[0],
      record[1],
      record[2],
      record[3],
      record[4],
      record[5],
      record[6],
      record[7],
      new Date(parseInt(record[8])),
      record[9],
    ],
  };
  return mpQuery;
}
