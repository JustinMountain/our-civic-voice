import { dropAllOntarioTables } from './db-population/dropAllOntarioTables';
import { populateOntarioMemberTables } from './db-population/populateOntarioTables';
import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../config/constants';

export async function initOntarioTablePopulation(): Promise<Boolean> {
  console.log(`Initializing Ontario table population...`)

  let ontarioablesDropped: Boolean = false;

  try {
    ontarioablesDropped = await dropAllOntarioTables();
    if (ontarioablesDropped) {
      await populateOntarioMemberTables();
      console.log(`${CONSOLE_HIGHLIGHT}Initialization of Ontario tables complete!${CONSOLE_RESET}`);
      return true;
    }
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not initialize Ontario table population. ${CONSOLE_RESET}`);
    throw error;
  }
  return false;
}
