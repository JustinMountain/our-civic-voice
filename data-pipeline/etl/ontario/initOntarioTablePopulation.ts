import pool from '../../config/databasePool';

// import { populateFederalMemberTable } from './populateFederalMemberTable';
// import { populateFederalMemberOfficeTable } from './populateFederalMemberOfficeTable';
import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../constants';

// import { mostRecentFederalRepCSVtoMemory, mostRecentFederalOfficeCSVtoMemory } from './transform/csvToMemory';
import { populateMemberTable, populateOfficeTable } from '../load/memoryToPostgres';
import { RepInfo, OfficeInfo } from '../tableInterfaces';

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
        // await populateMemberTable('ontario', memberTableInMemory);
      }

      if (officeData) {
        await populateOfficeTable('ontario', officeData);
      } else {
        // Retrieve from memory
        // await populateOfficeTable('ontario', officeTableInMemory);
      }


      // const memberTableInMemory = await mostRecentFederalRepCSVtoMemory();
      // const officeTableInMemory = await mostRecentFederalOfficeCSVtoMemory();

      // await populateMemberTable('ontario', memberTableInMemory);
      // await populateOfficeTable('ontario', officeTableInMemory);

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
