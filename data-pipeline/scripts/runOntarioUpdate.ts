import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../config/constants';
import { runOntarioMPPScraperToCSV } from './scrapers/ontario/createOntarioCSV';
import { initOntarioTablePopulation } from './db-population/ontario/initOntarioTableFromCSV';

/**
 * Runs the Ontario update process to scrape, check for updates, and populate the database as needed.
 */
export async function runOntarioUpdate(): Promise<Boolean> {
  const timeStarted = Date.now();
  console.log(`Checking for updates to Federal tables from public sources...`);

  try {
    const ontarioMPPCSV = await runOntarioMPPScraperToCSV();

    if (ontarioMPPCSV) {
      await initOntarioTablePopulation();
    }  
  } catch (error) { 
    console.error(`${CONSOLE_ERROR}Encountered an error while updating the Ontario sources: ${CONSOLE_RESET}`, error);
    throw error;
  }
  console.log(`${CONSOLE_HIGHLIGHT}Database was updated from public sources in ${Date.now() - timeStarted}ms!${CONSOLE_RESET}`);  
  return true; 
}
