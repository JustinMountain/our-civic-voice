import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from './config/constants';
import { initFederalTablePopulation } from './federal/initFederalTablesFromCSV';
import { initOntarioTablePopulation } from './ontario/initOntarioTableFromCSV';

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
