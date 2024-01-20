import pool from '../databasePool';

export async function dropAllOntarioTables(): Promise<Boolean> {
  try {
    const client = await pool.connect();

    // Ontario MPP Member Contact Info table
    console.log('Clearing Ontario MPP Member Contact Info table...');
    await client.query(`DELETE FROM ontario_mpp_offices;`);
    console.log('Successfully cleared Ontario MPP Member Contact Info table!\n');

    // Ontario MPP Member Info table
    console.log('Clearing Ontario MPP Member Info table...');
    await client.query(`DELETE FROM ontario_mpps;`);
    console.log('Successfully cleared Ontario MPP Member Info table!\n');

    client.release();
    return true;
  } catch (error) {
    console.log('Could not drop Ontario tables:');
    console.error(error);
    return false;
  }
}
