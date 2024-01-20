import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from './database/config/constants';
import { runFederalMPScraperToCSV } from './database/csv-sources/federal/createFederalMPCSV';
import { runFederalMPOfficeScraperToCSV } from './database/csv-sources/federal/createFederalMPOfficeCSV';
import { initFederalTablePopulation } from './database/db-population/federal/initFederalTablePopulation';
import { runOntarioMPPScraperToCSV } from './database/csv-sources/ontario/createOntarioCSV';
import { initOntarioTablePopulation } from './database/db-population/ontario/initOntarioTablePopulation';

async function runApplication() {
  const timeStarted = Date.now();
  console.log(`Checking for updates from public sources...`);

  // Federal Tables
  try {
    const federalMPsUpdated = await runFederalMPScraperToCSV();
    const federalMPOfficesUpdated = await runFederalMPOfficeScraperToCSV();
  
    if (federalMPsUpdated || federalMPOfficesUpdated) {
      await initFederalTablePopulation();
    }  
  } catch (error) { 
    console.error(`${CONSOLE_ERROR}Encountered an error while updating the Federal sources: ${CONSOLE_RESET}`, error);
    throw error;
  }

  // Ontario Tables
  try {
    const ontarioMPPCSV = await runOntarioMPPScraperToCSV();

    if (ontarioMPPCSV) {
      await initOntarioTablePopulation();
    }  
  } catch (error) { 
    console.error(`${CONSOLE_ERROR}Encountered an error while updating the Ontario sources: ${CONSOLE_RESET}`, error);
    throw error;
  }
  console.log(`${CONSOLE_HIGHLIGHT}Database was updated from public sources in in ${Date.now() - timeStarted}ms!${CONSOLE_RESET}`);   
}

runApplication();
