import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../config/constants';
import { runFederalPipeline } from './runFederalPipeline';
import { runOntarioPipeline } from './runOntarioPipeline';

/**
 * Runs the all of the update processes to scrape, check for updates, and populate the database as needed.
 */
export async function runAllPipelines(): Promise<Boolean> {
  console.log(`Checking for updates from public sources...`);
  const timeStarted = Date.now();
  let isAnyTableUpdated: Boolean = false;

  try {
    const updatedOntario = await runFederalPipeline();
    const updatedFederal = await runOntarioPipeline();  

    if (updatedOntario || updatedFederal) {
      isAnyTableUpdated = true;
    }
  } catch (error) { 
    console.error(`${CONSOLE_ERROR}Encountered an error while trying to update all sources: ${CONSOLE_RESET}`, error);
    throw error;
  }
  console.log(`\n${CONSOLE_HIGHLIGHT}Application is up to date with public sources!${CONSOLE_RESET}`);
  console.log(`The process took ${CONSOLE_HIGHLIGHT}${Date.now() - timeStarted}ms!${CONSOLE_RESET}\n`);   
  return isAnyTableUpdated;
}
