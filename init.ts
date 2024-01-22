import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from './database/config/constants';
import { initFederalTablePopulation } from './database/federal/initFederalTablesFromCSV';
import { initOntarioTablePopulation } from './database/ontario/initOntarioTableFromCSV';

async function initDatabase() {
  const timeStarted = Date.now();
  console.log(`Initializing the database from from CSV files on disk...`);

  try { 
    await initFederalTablePopulation(); 
    await initOntarioTablePopulation();
  } catch (error) { 
    console.error(`${CONSOLE_ERROR}Encountered an error trying to initialize the database: ${CONSOLE_RESET}`, error);
    throw error;
  }
  console.log(`\n${CONSOLE_HIGHLIGHT}Database was initialized in ${Date.now() - timeStarted}ms!${CONSOLE_RESET}\n`);   
}

initDatabase();
