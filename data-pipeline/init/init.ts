import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../config/constants';
import { initFederalTablePopulation } from '../scripts/db-population/federal/initFederalTablesFromCSV';
import { initOntarioTablePopulation } from '../scripts/db-population/ontario/initOntarioTableFromCSV';
import { updateAllRepMatView } from '../scripts/db-population/repMatView';

/**
 * Initializes the database by populating the tables with data from the CSV files on disk.
 */
async function initDatabase() {
  const timeStarted = Date.now();
  console.log(`Initializing the database from from CSV files on disk...`);

  try { 
    await initFederalTablePopulation(); 
    await initOntarioTablePopulation();
    await updateAllRepMatView();
  } catch (error) { 
    console.error(`${CONSOLE_ERROR}Encountered an error trying to initialize the database: ${CONSOLE_RESET}`, error);
    throw error;
  }
  console.log(`\n${CONSOLE_HIGHLIGHT}Database was initialized in ${Date.now() - timeStarted}ms!${CONSOLE_RESET}\n`);   
}

initDatabase();
