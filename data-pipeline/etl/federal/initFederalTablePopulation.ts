import pool from '../../config/databasePool';

// import { populateFederalMemberTable } from './populateFederalMemberTable';
// import { populateFederalMemberOfficeTable } from './populateFederalMemberOfficeTable';
import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../constants';

import { mostRecentFederalRepCSVtoMemory, mostRecentFederalOfficeCSVtoMemory } from './transform/csvToMemory';
import { populateFederalMemberTable, populateFederalOfficeTable } from './load/memoryToPostgres';

/**
 * Initializes the Federal tables from the CSV sources.
 * @returns True if successful, otherwise false.
 */
export async function initFederalTablePopulation(): Promise<Boolean> {
  console.log(`Initializing Federal table population...`)

  let federalTablesDropped: Boolean = false;

  try {
    federalTablesDropped = await dropAllFederalTables();
    if (federalTablesDropped) {
      const memberTableInMemory = await mostRecentFederalRepCSVtoMemory();
      const officeTableInMemory = await mostRecentFederalOfficeCSVtoMemory();

      await populateFederalMemberTable(memberTableInMemory);
      await populateFederalOfficeTable(officeTableInMemory);

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
    console.log('Clearing Federal MP Member Contact Info table...');
    await client.query(`DELETE FROM federal_mp_offices_new;`);
    console.log(`${CONSOLE_HIGHLIGHT}Successfully cleared Federal MP Member Contact Info table!${CONSOLE_RESET}`);

    // Federal MP Member Info table
    console.log('Clearing Federal MP Member Info table...');
    await client.query(`DELETE FROM federal_mps_new;`);
    console.log(`${CONSOLE_HIGHLIGHT}Successfully cleared Federal MP Member Info table!${CONSOLE_RESET}`);

    client.release();
    return true;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not drop Federal tables. ${CONSOLE_RESET}`);
    throw error; 
  }
}
