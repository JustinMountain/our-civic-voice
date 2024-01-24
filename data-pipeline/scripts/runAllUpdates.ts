import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../config/constants';
import { runFederalUpdate } from './runFederalUpdate';
import { runOntarioUpdate } from './runOntarioUpdate';

export async function runAllUpdates() {
  const timeStarted = Date.now();
  console.log(`Checking for updates from public sources...`);

  try {
    await runFederalUpdate();
    await runOntarioUpdate();  
  } catch (error) { 
    console.error(`${CONSOLE_ERROR}Encountered an error while trying to update all sources: ${CONSOLE_RESET}`, error);
    throw error;
  }
  console.log(`\n${CONSOLE_HIGHLIGHT}Application is up to date with public sources!${CONSOLE_RESET}`);
  console.log(`The process took ${CONSOLE_HIGHLIGHT}${Date.now() - timeStarted}ms!${CONSOLE_RESET}\n`);   
}
