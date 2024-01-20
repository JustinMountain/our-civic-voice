import { dropAllOntarioTables } from './dropAllOntarioTables';
import { populateOntarioMemberTables } from './populateOntarioTables';

const ontarioMemberInfoDirectory = './database/csv-sources/ontario/csv-download/';

export async function initOntarioTablePopulation(): Promise<Boolean> {

  let ontarioablesDropped: Boolean = false;

  try {
    ontarioablesDropped = await dropAllOntarioTables();
  } catch (error) {
    console.log(error);
    return false;
  }

  if (ontarioablesDropped) {
    try {
      // Populate Federal Tables
      await populateOntarioMemberTables(ontarioMemberInfoDirectory);
    
      return true;
    } catch (error) {
      console.log('Could not drop Ontario tables:');
      console.log(error);
      return false;
    }
  }
  return false;
}
