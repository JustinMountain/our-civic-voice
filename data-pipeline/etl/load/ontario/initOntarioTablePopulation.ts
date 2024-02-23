import pool from '../../config/databasePool';

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../config/constants';
import { ONT_MEMBER_INFO_DIRECTORY, ONT_MEMBER_OFFICE_DIRECTORY } from '../../config/constants';

import { RepInfo, OfficeInfo } from '../../config/tableInterfaces';
import { populateMemberTable, populateOfficeTable } from '../memoryToPostgres';
import { mostRecentCSVtoMemory, mostRecentOfficeCSVtoMemory } from '../../transform/backupCsvToMemory';

/**
 * Initializes the Federal tables from the CSV sources.
 * @returns True if successful, otherwise false.
 */
export async function initOntarioTablePopulation(repData?: RepInfo[], officeData?: OfficeInfo[]): Promise<Boolean> {
  console.log(`Initializing Federal table population...`)

  let ontarioTablesDropped: Boolean = false;

  try {
    ontarioTablesDropped = await dropAllOntarioTables();
    if (ontarioTablesDropped) {
      if (repData) {
        await populateMemberTable('ontario', repData);
      } else {
        // Retrieve from memory
        const memberTableInMemory = await mostRecentCSVtoMemory(ONT_MEMBER_INFO_DIRECTORY);

        // Populate Table
        await populateMemberTable('ontario', memberTableInMemory);
      }

      if (officeData) {
        await populateOfficeTable('ontario', officeData);
      } else {
        // Retrieve from memory
        const officeTableInMemory = await mostRecentOfficeCSVtoMemory(ONT_MEMBER_OFFICE_DIRECTORY);

        // Populate Table
        await populateOfficeTable('ontario', officeTableInMemory);
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
async function dropAllOntarioTables(): Promise<Boolean> {
  console.log(`Dropping all Ontario tables from the database...`)

  try {
    const client = await pool.connect();

    // Ontario MPP Member Office table
    console.log('Clearing Ontario MPP Member Office table table...');
    await client.query(`DELETE FROM ontario_offices;`);
    console.log(`${CONSOLE_HIGHLIGHT}Successfully cleared Ontario MPP Member Office table!${CONSOLE_RESET}`);

    // Ontario MPP Member Info table
    console.log('Clearing Ontario MPP Member Info table...');
    await client.query(`DELETE FROM ontario_reps;`);
    console.log(`${CONSOLE_HIGHLIGHT}Successfully cleared Ontario MPP Member Info table!${CONSOLE_RESET}`);

    client.release();
    return true;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not drop Ontario tables. ${CONSOLE_RESET}`);
    throw error; 
  }
}
