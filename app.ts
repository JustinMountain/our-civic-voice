import { runFederalMPScraperToCSV } from './database/db-population/federal/createFederalMPCSV';
import { runFederalMPOfficeScraperToCSV } from './database/db-population/federal/createFederalMPOfficeCSV';
import { checkForCSVUpdate } from './database/db-population/utilities';

const federalMemberInfoDirectory = './database/csv-sources/federal/member-info/';
const federalMemberContactInfoDirectory = './database/csv-sources/federal/contact-info/';


async function run() {
  const federalMPs = await runFederalMPScraperToCSV();
  const federalMPsUpdated = await checkForCSVUpdate(federalMPs, federalMemberInfoDirectory)

  // const federalMPOffices = await runFederalMPOfficeScraperToCSV();
  // const federalMPOfficesUpdated = await checkForCSVUpdate(federalMPOffices, federalMemberContactInfoDirectory)
}

run();
