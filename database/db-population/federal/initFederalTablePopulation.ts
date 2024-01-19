import { dropAllFederalTables } from './dropAllFederalTables';
import { populateFederalMemberTable } from './populateFederalTable';
import { populateFederalMemberOfficeTable } from './populateFederalOfficeTable';

const federalMemberInfoDirectory = './database/csv-sources/federal/member-info/';
const federalMemberContactInfoDirectory = './database/csv-sources/federal/contact-info/';

export async function initFederalTablePopulation(): Promise<Boolean> {

  let federalTablesDropped: Boolean = false;

  try {
    federalTablesDropped = await dropAllFederalTables();
  } catch (error) {
    console.log(error);
    return false;
  }

  if (federalTablesDropped) {
    try {
      // Populate Federal Tables
      await populateFederalMemberTable(federalMemberInfoDirectory);
      await populateFederalMemberOfficeTable(federalMemberContactInfoDirectory);
    
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  return false;
}
