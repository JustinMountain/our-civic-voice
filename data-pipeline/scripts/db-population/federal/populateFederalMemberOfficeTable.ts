import pool from '../../../config/databasePool';
import { findCSVFiles } from '../../../config/csvUtilities';
import { processCSVtoMemory } from '../../../config/populationUtilities';
import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../../config/constants';
import { FED_MEMBER_CONTACT_DIRECTORY } from '../../../config/constants';
import { dbQuery } from '../../../config/populationUtilities';

/**
 * Populates the federal_mp_offices table with the data from the saved CSV files.
 * @returns True if successful, otherwise false.
 */
export async function populateFederalMemberOfficeTable(): Promise<Boolean> {
  let recentFileName: string = '';
  let data: string[][] = [];

  console.log(`Retrieving data from ${FED_MEMBER_CONTACT_DIRECTORY}...`);
  try {
    const allFileNames = await findCSVFiles(FED_MEMBER_CONTACT_DIRECTORY);
    recentFileName = allFileNames[0];
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not find CSV file. ${CONSOLE_RESET}`);
    throw error;
  }

  if (recentFileName !== '') {
    try {
      data = await processCSVtoMemory(`${FED_MEMBER_CONTACT_DIRECTORY}/${recentFileName}`);  
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
      const mpOfficeQuery = createMPOfficeQuery(record);
      await client.query(mpOfficeQuery);
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
 * Creates a database query for inserting a single record into the federal_mp_offices table.
 * @param record A single record representing one Federal MP Office.
 * @returns A dbQuery object to use with a client connection.
 */
function createMPOfficeQuery(record: string[]): dbQuery {
  const mppOfficeQuery = {
    text: `INSERT INTO federal_mp_offices (
      constituency,
      general_email,
      website,
      office_type,
      office_title,
      office_address,
      office_city,
      office_province,
      office_postal_code,
      office_note,
      office_telephone,
      office_fax,
      source,
      updated_date) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 , $11, $12, $13, $14);`,
    values: [
      record[1],
      record[2],
      record[3],
      record[4],
      record[5],
      record[6],
      record[7],
      record[8],
      record[9],
      record[10],
      record[11],
      record[12],
      record[13],
      new Date(parseInt(record[14])),
    ],
  }
  return mppOfficeQuery;
}
