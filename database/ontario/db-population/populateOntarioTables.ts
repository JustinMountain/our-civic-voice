import pool from '../../config/databasePool';
import { findCSVFiles } from '../../config/csvUtilities';
import { processCSVtoMemory } from '../../config/populationUtilities';
import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../config/constants';
import { dbQuery } from '../../config/populationUtilities';

async function retrieveDataForPopulation(directory: string): Promise<string[][]> {
  let recentFileName: string = '';
  let data: string[][] = [];

  console.log(`Retrieving data from ${directory}...`);
  try {
    const allFileNames = await findCSVFiles(directory);
    recentFileName = allFileNames[0];
    if (recentFileName !== '') {
      data = await processCSVtoMemory(`${directory}${recentFileName}`);  
    }
    return data;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not retrieve CSV file.${CONSOLE_RESET}`)
    throw error;
  }
}

function createExistQuery(record: string[]): dbQuery {
  const existsQuery: dbQuery = {
    text: 'SELECT EXISTS(SELECT 1 FROM ontario_mpps WHERE riding_name = $1)',
    values: [
      record[14], // riding_name
    ],
  };
  return existsQuery;
}

function createMPPQuery(record: string[]): dbQuery {
  let memID: number = 0;
  if (parseInt(record[17], 10)) {
    memID = parseInt(record[17], 10);
  }
  const mppQuery = {
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
  return mppQuery;
}

function createMPPOfficeQuery(record: string[]): dbQuery {
  const mppOfficeQuery = {
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
  return mppOfficeQuery;
}

export async function populateOntarioMemberTables(directory: string): Promise<Boolean> {
  let data = await retrieveDataForPopulation(directory);

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
      if (!exists) {
        await client.query(mppQuery);
      }
      await client.query(mppOfficeQuery);
    }

    console.log(`${CONSOLE_HIGHLIGHT}Successfully inserted all Ontario Member info!${CONSOLE_RESET}`);
    client.release();
    return true;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Received database error. ${CONSOLE_RESET}`);
    throw error;
  }
}
