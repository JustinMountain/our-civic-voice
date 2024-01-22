import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../config/constants';
import { runFederalMPScraperToCSV } from './csv-sources/createFederalMPCSV';
import { runFederalMPOfficeScraperToCSV } from './csv-sources/createFederalMPOfficeCSV';
import { initFederalTablePopulation } from './initFederalTablesFromCSV';

export async function runFederalUpdate() {
  const timeStarted = Date.now();
  console.log(`Checking for updates to Federal tables from public sources...`);

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

  console.log(`${CONSOLE_HIGHLIGHT}Federal tables were updated from public sources in ${Date.now() - timeStarted}ms!${CONSOLE_RESET}`);   
}
