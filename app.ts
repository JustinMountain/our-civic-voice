import { checkForCSVUpdate } from './database/csv-sources/csvUtilities';
import { runFederalMPScraperToCSV } from './database/csv-sources/federal/createFederalMPCSV';
import { runFederalMPOfficeScraperToCSV } from './database/csv-sources/federal/createFederalMPOfficeCSV';
import { dropAllFederalTables } from './database/db-population/federal/dropAllFederalTables';
import { initFederalTablePopulation } from './database/db-population/federal/initFederalTablePopulation';
import { runOntarioMPPScraperToCSV } from './database/csv-sources/ontario/createOntarioCSV';

const federalMemberInfoDirectory = './database/csv-sources/federal/member-info/';
const federalMemberContactInfoDirectory = './database/csv-sources/federal/contact-info/';

async function runApplication() {
  // const federalMPs = await runFederalMPScraperToCSV();
  // const federalMPsUpdated = await checkForCSVUpdate(federalMPs, federalMemberInfoDirectory);

  // const federalMPOffices = await runFederalMPOfficeScraperToCSV();
  // const federalMPOfficesUpdated = await checkForCSVUpdate(federalMPOffices, federalMemberContactInfoDirectory);

  // if (federalMPsUpdated || federalMPOfficesUpdated) {
  //   await dropAllFederalTables();
  //   await initFederalTablePopulation();
  // }


  const ontarioMPPCSV = runOntarioMPPScraperToCSV();


}

runApplication();
