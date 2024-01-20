import pool from '../../config/databasePool';
import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../config/constants';

export async function dropAllOntarioTables(): Promise<Boolean> {
  console.log(`Dropping all Ontario tables from the database...`)

  try {
    const client = await pool.connect();

    // Ontario MPP Member Contact Info table
    console.log('Clearing Ontario MPP Member Contact Info table...');
    await client.query(`DELETE FROM ontario_mpp_offices;`);
    console.log(`Successfully ${CONSOLE_HIGHLIGHT}cleared Ontario MPP Member Contact Info${CONSOLE_RESET} table!`);

    // Ontario MPP Member Info table
    console.log('Clearing Ontario MPP Member Info table...');
    await client.query(`DELETE FROM ontario_mpps;`);
    console.log(`Successfully ${CONSOLE_HIGHLIGHT}cleared Ontario MPP Member Info${CONSOLE_RESET} table!`);

    client.release();
    return true;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not drop Ontario tables. ${CONSOLE_RESET}`);
    throw error;
  }
}
