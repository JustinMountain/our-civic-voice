import { dropAllFederalTables } from './dropAllFederalTables';
import { populateFederalMemberTable } from './populateFederalMemberTable';
import { populateFederalMemberOfficeTable } from './populateFederalMemberOfficeTable';
import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../../config/constants';

/**
 * Initializes the Federal tables from the CSV sources.
 * @returns True if successful, otherwise false.
 */
export async function initFederalTablePopulation(): Promise<Boolean> {
  console.log(`Initializing Federal table population...`)

  let federalTablesDropped: Boolean = false;

  try {
    federalTablesDropped = await dropAllFederalTables();
    if (federalTablesDropped) {
      const memberTablePopulated = await populateFederalMemberTable();
      const officeTablePopulated = await populateFederalMemberOfficeTable();
      if (memberTablePopulated && officeTablePopulated) { 
        console.log(`${CONSOLE_HIGHLIGHT}Initialization of Federal tables complete!${CONSOLE_RESET}`);
        return true; 
      }
    }
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not initialize Federal table population. ${CONSOLE_RESET}`);
    throw error;
  }
  return false;
}



