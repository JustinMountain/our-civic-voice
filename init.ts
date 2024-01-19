import { initFederalTablePopulation } from './database/db-population/federal/initFederalTablePopulation';

async function initDatabase() {
  try {
    const federalTablesPopulated: Boolean = await initFederalTablePopulation();
  } catch (error) {
    console.log(error);
    return false;
  }
}

initDatabase();
