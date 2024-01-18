import { runFederalMPScraperToCSV } from './database/csv-sources/federal/createFederalMPCSV';
import { runFederalMPOfficeScraperToCSV } from './database/csv-sources/federal/createFederalMPOfficeCSV';
import { checkForCSVUpdate } from './database/csv-sources/csvUtilities';

import { populateFederalMemberTable } from './database/db-population/federal/populateFederalTables';

const federalMemberInfoDirectory = './database/csv-sources/federal/member-info/';
const federalMemberContactInfoDirectory = './database/csv-sources/federal/contact-info/';


async function run() {
  const federalMPs = await runFederalMPScraperToCSV();
  const federalMPsUpdated = await checkForCSVUpdate(federalMPs, federalMemberInfoDirectory);
  
  if (federalMPsUpdated) {
    await populateFederalMemberTable(federalMemberInfoDirectory);
  }

  // const federalMPOffices = await runFederalMPOfficeScraperToCSV();
  // const federalMPOfficesUpdated = await checkForCSVUpdate(federalMPOffices, federalMemberContactInfoDirectory)
}

run();
