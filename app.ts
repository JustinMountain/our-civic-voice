import { runFederalMPScraperToCSV } from './database/csv-sources/federal/createFederalMPCSV';
import { runFederalMPOfficeScraperToCSV } from './database/csv-sources/federal/createFederalMPOfficeCSV';
import { dropAllFederalTables } from './database/db-population/federal/dropAllFederalTables';
import { initFederalTablePopulation } from './database/db-population/federal/initFederalTablePopulation';
import { runOntarioMPPScraperToCSV } from './database/csv-sources/ontario/createOntarioCSV';

async function runApplication() {
  // Federal Tables
  const federalMPsUpdated = await runFederalMPScraperToCSV();
  const federalMPOfficesUpdated = await runFederalMPOfficeScraperToCSV();

  if (federalMPsUpdated || federalMPOfficesUpdated) {
    await dropAllFederalTables();
    await initFederalTablePopulation();
  }

  // Ontario Tables
  const ontarioMPPCSV = runOntarioMPPScraperToCSV();

}

runApplication();
