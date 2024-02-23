import pool from '../../config/databasePool';

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../config/constants';
import { FED_MEMBER_INFO_DIRECTORY, FED_MEMBER_OFFICE_DIRECTORY } from '../../config/constants';

import { RepInfo, OfficeInfo } from '../../config/tableInterfaces';
import { populateMemberTable, populateOfficeTable } from '../memoryToPostgres';
import { mostRecentCSVtoMemory, mostRecentOfficeCSVtoMemory } from '../../transform/backupCsvToMemory';

/**
 * Initializes the Federal tables from the CSV sources.
 * @returns True if successful, otherwise false.
 */
export async function initFederalTablePopulation(repData?: RepInfo[], officeData?: OfficeInfo[]): Promise<Boolean> {
  console.log(`Initializing Federal table population...`)

  let federalTablesDropped: Boolean = false;

  try {
    federalTablesDropped = await dropAllFederalTables();
    if (federalTablesDropped) {
      if (repData) {
        await populateMemberTable('federal', repData);
      } else {
        // Retrieve from memory
        const memberTableInMemory = await mostRecentCSVtoMemory(FED_MEMBER_INFO_DIRECTORY);

        // Populate Table
        await populateMemberTable('federal', memberTableInMemory);
      }

      if (officeData) {
        await populateOfficeTable('federal', officeData);
      } else {
        // Retrieve from memory
        const officeTableInMemory = await mostRecentOfficeCSVtoMemory(FED_MEMBER_OFFICE_DIRECTORY);

        // Populate Table
        await populateOfficeTable('federal', officeTableInMemory);
      }

      console.log(`${CONSOLE_HIGHLIGHT}Initialization of Federal tables complete!${CONSOLE_RESET}`);
      return true; 
    }
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not initialize Federal table population. ${CONSOLE_RESET}`);
    throw error;
  }
  return false;
}

/**
 * Drops all Federal MP tables from the database.
 * @returns True if all tables were dropped successfully, false otherwise.
 */
async function dropAllFederalTables(): Promise<Boolean> {
  console.log(`Dropping all Federal tables from the database...`)

  try {
    const client = await pool.connect();

    // Federal MP Member Contact Info table
    console.log('Clearing Federal MP Member Office Info table...');
    await client.query(`DELETE FROM federal_offices;`);
    console.log(`${CONSOLE_HIGHLIGHT}Successfully cleared Federal MP Member Contact Info table!${CONSOLE_RESET}`);

    // Federal MP Member Info table
    console.log('Clearing Federal MP Member Info table...');
    await client.query(`DELETE FROM federal_reps;`);
    console.log(`${CONSOLE_HIGHLIGHT}Successfully cleared Federal MP Member Info table!${CONSOLE_RESET}`);

    client.release();
    return true;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not drop Federal tables. ${CONSOLE_RESET}`);
    throw error; 
  }
}
