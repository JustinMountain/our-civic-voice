import pool from '../databasePool';

export async function dropAllFederalTables(): Promise<Boolean> {
  try {
    const client = await pool.connect();

    // Federal MP Member Contact Info table
    console.log('Clearing Federal MP Member Contact Info table...');
    await client.query(`DELETE FROM federal_mp_offices;`);
    console.log('Successfully cleared Federal MP Member Contact Info table!\n');

    // Federal MP Member Info table
    console.log('Clearing Federal MP Member Info table...');
    await client.query(`DELETE FROM federal_mps`);
    console.log('Successfully cleared Federal MP Member Info table!\n');

    client.release();
    return true;
  } catch (error) {
    console.log('Could not drop Federal tables:');
    console.error(error);
    return false;
  }
}
