import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../config/constants';
import { runOntarioMPPScraperToCSV } from './csv-sources/createOntarioCSV';
import { initOntarioTablePopulation } from './initOntarioTableFromCSV';

export async function runOntarioUpdate() {
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
}
