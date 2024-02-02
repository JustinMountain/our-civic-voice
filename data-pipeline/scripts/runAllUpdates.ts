import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../config/constants';
import { runFederalUpdate } from './runFederalUpdate';
import { runOntarioUpdate } from './runOntarioUpdate';
import { updateAllRepMatView } from './db-population/repMatView';

/**
 * Runs the all of the update processes to scrape, check for updates, and populate the database as needed.
 */
export async function runAllUpdates() {
  const timeStarted = Date.now();
  console.log(`Checking for updates from public sources...`);

  try {
    const updatedOntario = await runFederalUpdate();
    const updatedFederal = await runOntarioUpdate();  

    if (updatedOntario || updatedFederal) {
      await updateAllRepMatView()
    }

  } catch (error) { 
    console.error(`${CONSOLE_ERROR}Encountered an error while trying to update all sources: ${CONSOLE_RESET}`, error);
    throw error;
  }
  console.log(`\n${CONSOLE_HIGHLIGHT}Application is up to date with public sources!${CONSOLE_RESET}`);
  console.log(`The process took ${CONSOLE_HIGHLIGHT}${Date.now() - timeStarted}ms!${CONSOLE_RESET}\n`);   
}
