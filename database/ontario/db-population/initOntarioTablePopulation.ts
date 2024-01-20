import { dropAllOntarioTables } from './dropAllOntarioTables';
import { populateOntarioMemberTables } from './populateOntarioTables';
import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../config/constants';

const ontarioMemberInfoDirectory = './database/csv-sources/ontario/csv-download/';

export async function initOntarioTablePopulation(): Promise<Boolean> {
  console.log(`Initializing Ontario table population...`)

  let ontarioablesDropped: Boolean = false;

  try {
    ontarioablesDropped = await dropAllOntarioTables();
    if (ontarioablesDropped) {
      await populateOntarioMemberTables(ontarioMemberInfoDirectory);
      console.log(`${CONSOLE_HIGHLIGHT}Initialization of Ontario tables complete!${CONSOLE_RESET}`);
      return true;
    }
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not initialize Ontario table population. ${CONSOLE_RESET}`);
    throw error;
  }
  return false;
}
