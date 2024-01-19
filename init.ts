import { dropAllFederalTables } from './database/db-population/federal/dropAllFederalTables';
import { populateFederalMemberTable } from './database/db-population/federal/populateFederalTable';
import { populateFederalMemberOfficeTable } from './database/db-population/federal/populateFederalOfficeTable';

const federalMemberInfoDirectory = './database/csv-sources/federal/member-info/';
const federalMemberContactInfoDirectory = './database/csv-sources/federal/contact-info/';

async function run() {

  const federalTablesDropped: Boolean = await dropAllFederalTables();

  if (federalTablesDropped) {
    // Populate Federal Tables
    await populateFederalMemberTable(federalMemberInfoDirectory);
    await populateFederalMemberOfficeTable(federalMemberContactInfoDirectory);
  }
}

run();
