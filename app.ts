import { runFederalMPScraperToCSV } from './database/csv-sources/federal/createFederalMPCSV';
import { runFederalMPOfficeScraperToCSV } from './database/csv-sources/federal/createFederalMPOfficeCSV';
import { initFederalTablePopulation } from './database/db-population/federal/initFederalTablePopulation';
import { runOntarioMPPScraperToCSV } from './database/csv-sources/ontario/createOntarioCSV';
import { initOntarioTablePopulation } from './database/db-population/ontario/initOntarioTablePopulation';

async function runApplication() {
  // Federal Tables
  const federalMPsUpdated = await runFederalMPScraperToCSV();
  const federalMPOfficesUpdated = await runFederalMPOfficeScraperToCSV();

  if (federalMPsUpdated || federalMPOfficesUpdated) {
    await initFederalTablePopulation();
  }

  // Ontario Tables
  const ontarioMPPCSV = await runOntarioMPPScraperToCSV();

  if (ontarioMPPCSV) {
    await initOntarioTablePopulation();
  }
}

runApplication();
