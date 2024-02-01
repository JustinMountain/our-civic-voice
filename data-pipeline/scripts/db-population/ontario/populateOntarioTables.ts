import pool from '../../../config/databasePool';
import { findCSVFiles } from '../../../config/csvUtilities';
import { processCSVtoMemory } from '../../../config/populationUtilities';
import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../../config/constants';
import { ONT_MEMBER_INFO_DIRECTORY } from '../../../config/constants';
import { dbQuery } from '../../../config/populationUtilities';

/**
 * Populates the ontario_mpps table with the data from the saved CSV files.
 * @returns True if successful, otherwise false.
 */
export async function populateOntarioMemberTables(): Promise<Boolean> {
  let data = await retrieveDataForPopulation();

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

      const existsQuery = createExistQuery(record);
      const mppQuery = createMPPQuery(record);
      const mppOfficeQuery = createMPPOfficeQuery(record);

      const res = await client.query(existsQuery);
      const exists = res.rows[0].exists;
      if (!exists && mppQuery !== null) {
        await client.query(mppQuery);
      }

      if (mppOfficeQuery !== null) {
        await client.query(mppOfficeQuery);
      }
    }

    console.log(`${CONSOLE_HIGHLIGHT}Successfully inserted all Ontario Member info!${CONSOLE_RESET}`);
    client.release();
    return true;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Received database error. ${CONSOLE_RESET}`);
    throw error;
  }
}

/**
 * Finds the most recent CSV file in the directory and processes it into memory.
 * @returns A 2D array of strings representing the CSV file.
 */
async function retrieveDataForPopulation(): Promise<string[][]> {
  let recentFileName: string = '';
  let data: string[][] = [];

  console.log(`Retrieving data from ${ONT_MEMBER_INFO_DIRECTORY}...`);
  try {
    const allFileNames = await findCSVFiles(ONT_MEMBER_INFO_DIRECTORY);
    recentFileName = allFileNames[0];
    if (recentFileName !== '') {
      data = await processCSVtoMemory(`${ONT_MEMBER_INFO_DIRECTORY}${recentFileName}`);  
    }
    return data;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not retrieve CSV file.${CONSOLE_RESET}`)
    throw error;
  }
}

/**
 * Creates a database query for checking if a record exists for the current MPP.
 * @param record A single record representing one Ontario MPP and their office contact info.
 * @returns A dbQuery object to use with a client connection.
 */
function createExistQuery(record: string[]): dbQuery {
  const existsQuery: dbQuery = {
    text: 'SELECT EXISTS(SELECT 1 FROM ontario_mpps WHERE constituency = $1)',
    values: [
      record[14],
    ],
  };
  return existsQuery;
}

/**
 * Creates a database query for inserting a single record into the ontario_mpps table.
 * @param record A single record representing one Ontario MPP and their office contact info.
 * @returns A dbQuery object to use with a client connection.
 */
function createMPPQuery(record: string[]): dbQuery | null {
  let memID: number = 0;
  if (parseInt(record[17], 10)) {
    memID = parseInt(record[17], 10);
  } else {
    return null;
  }

  const mppQuery = {
    text: `INSERT INTO ontario_mpps (
      member_id,
      constituency,
      parliamentary_role,
      party,
      first_name,
      last_name,
      honorific,
      updated_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
    values: [
      memID,
      record[14].trim(),
      record[16].trim(),
      record[15].trim(),
      record[1].trim(),
      record[2].trim(),
      record[0].trim(),
    ],
  };
  return mppQuery;
}

/**
 * Creates a database query for inserting a single record into the ontario_mpp_offices table.
 * @param record A single record representing one Ontario MPP and their office contact info.
 * @returns A dbQuery object to use with a client connection.
 */
function createMPPOfficeQuery(record: string[]): dbQuery | null {
  let memID: number = 0;
  if (parseInt(record[17], 10)) {
    memID = parseInt(record[17], 10);
  } else {
    return null;
  }

  const mppOfficeQuery = {
    text: `INSERT INTO ontario_mpp_offices (
      member_id,
      constituency,
      office_type,
      office_address,
      office_city,
      office_province,
      office_postal_code,
      office_email,
      general_email,
      office_telephone,
      office_fax,
      office_toll_free,
      office_tty,
      updated_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())`,
    values: [
      memID, // CHECK THIS
      record[14].trim(),
      record[3].trim(),
      record[4].trim(),
      record[5].trim(),
      record[6].trim(),
      record[7].trim(),
      record[8].trim(),
      record[9].trim(),
      record[10].trim(),
      record[11].trim(),
      record[12].trim(),
      record[13].trim(),
    ],
  };
  return mppOfficeQuery;
}
