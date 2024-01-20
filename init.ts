import { initFederalTablePopulation } from './database/db-population/federal/initFederalTablePopulation';
import { initOntarioTablePopulation } from './database/db-population/ontario/initOntarioTablePopulation';

async function initDatabase() {
  // Initialize the Federal Tables
  try {
    await initFederalTablePopulation();
  } catch (error) {
    console.log(error);
    return false;
  }

  // Initialize the Ontario Tables
  try {
    await initOntarioTablePopulation();
  } catch (error) {
    console.log(error);
    return false;
  }

}
initDatabase();
