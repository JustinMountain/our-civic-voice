import pool from '../../config/databasePool';
import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../config/constants';

/**
 * Drops all Federal MP tables from the database.
 * @returns True if all tables were dropped successfully, false otherwise.
 */
export async function dropAllFederalTables(): Promise<Boolean> {
  console.log(`Dropping all Federal tables from the database...`)

  try {
    const client = await pool.connect();

    // Federal MP Member Contact Info table
    console.log('Clearing Federal MP Member Contact Info table...');
    await client.query(`DELETE FROM federal_mp_offices;`);
    console.log(`${CONSOLE_HIGHLIGHT}Successfully cleared Federal MP Member Contact Info table!${CONSOLE_RESET}`);

    // Federal MP Member Info table
    console.log('Clearing Federal MP Member Info table...');
    await client.query(`DELETE FROM federal_mps;`);
    console.log(`${CONSOLE_HIGHLIGHT}Successfully cleared Federal MP Member Info table!${CONSOLE_RESET}`);

    client.release();
    return true;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not drop Federal tables. ${CONSOLE_RESET}`);
    throw error; 
  }
}
