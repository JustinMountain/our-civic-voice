import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../etl/config/constants';
import { initFederalTablePopulation } from '../etl/load/federal/initFederalTablePopulation';
import { initOntarioTablePopulation } from '../etl/load/ontario/initOntarioTablePopulation';



// Materialized View stuff

// Make sure endpoints function as expected



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
