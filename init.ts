import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from './database/config/constants';
import { initFederalTablePopulation } from './database/federal/db-population/initFederalTablePopulation';
import { initOntarioTablePopulation } from './database/ontario/db-population/initOntarioTablePopulation';

async function initDatabase() {
  const timeStarted = Date.now();
  console.log(`Initializing the database from from CSV files on disk...`);

  // Initialize the Federal Tables
  try { await initFederalTablePopulation(); 
  } catch (error) { console.error(error); }

  // Initialize the Ontario Tables
  try { await initOntarioTablePopulation();
  } catch (error) { 
    console.error(`${CONSOLE_ERROR}Encountered an error trying to initialize the database: ${CONSOLE_RESET}`, error);
    throw error;
  }
  console.log(`${CONSOLE_HIGHLIGHT}Database was initialized in ${Date.now() - timeStarted}ms!${CONSOLE_RESET}`);   
}

initDatabase();
