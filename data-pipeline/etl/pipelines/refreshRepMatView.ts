import pool from '../config/databasePool';
import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../config/constants';

const refreshMatViewQuery = `REFRESH MATERIALIZED VIEW all_representatives`;

/**
 * Updates the 'All Representatives' Materialized View.
 * @returns True if the view was successfully created, false otherwise.
 */
export async function refreshRepMatView(): Promise<Boolean> {
  console.log(`Updating the 'All Representatives' Materialized View...`)
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query(refreshMatViewQuery);

    await client.query('COMMIT');
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not create the 'All Representatives' Materialized View. ${CONSOLE_RESET}`);
    throw error;
  } finally {
    client.release();
  }
  console.log(`${CONSOLE_HIGHLIGHT}Successfully updated the 'All Representatives' Materialized View...${CONSOLE_RESET}`)
  return true;
}
