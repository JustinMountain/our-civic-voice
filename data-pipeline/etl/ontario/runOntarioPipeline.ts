import axios from 'axios';
import axiosRetry from 'axios-retry';

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../constants';
import { ONT_MEMBER_INFO_DIRECTORY } from '../constants';

import { downloadOntarioMPPCSV } from './extract/downloadOntarioCSV';
import { parseOntarioCSV } from './transform/parseResponses';
import { handleCSVUpdateConditions } from '../utilities';

import { scrapeOntarioMPPs, scrapeOntarioMPPDataFromURLs } from './extract/scrapeOntarioMPPs';


const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'document/xml',
    'Accept': 'document/xml'
  }
});

// Setup axios retry for status code 5xx and Network errors
axiosRetry(axiosInstance, {
  retries: 5,
  retryDelay: (retryCount) => { return retryCount * 1000},
  onRetry: (count, error, req) => { console.error(`${CONSOLE_ERROR}Retry attempt #${count}${CONSOLE_RESET} got ${error}`); },
  retryCondition: axiosRetry.isNetworkOrIdempotentRequestError, 
})  
  

async function runOntarioPipeline() {
  const timeRetrieved = Date.now();

  try {


    // Initiates downloading the Ontario CSV file
    const createdOntarioCSV = await downloadOntarioMPPCSV(axiosInstance);
    let isOntarioRepCSVUpdated: Boolean = false;

    // Checks if the CSV file is updated
    if (createdOntarioCSV) {
      isOntarioRepCSVUpdated = await handleCSVUpdateConditions(ONT_MEMBER_INFO_DIRECTORY);
    }


    // Extract DONE
    // Work on Transform step



    // When the CSV file is updated, the pipeline continues
    if (isOntarioRepCSVUpdated) {

      // Scrape for remaining information
      const ontarioMPPages = await scrapeOntarioMPPs(axiosInstance);
      const ontarioMPDataFromURLs = await scrapeOntarioMPPDataFromURLs(axiosInstance, ontarioMPPages);

      // Parse the scraped content into memory

      // Parse the content of the source CSV file
      // const ontarioCSVData = await parseOntarioCSV(ONT_MEMBER_INFO_DIRECTORY);

      console.log(ontarioMPDataFromURLs);


      // Transform parsed data to standardized format

      // Creates CSV from standardized data

      // Checks created CSV files for updates

      // Re-initialize tables


      console.log(`${CONSOLE_HIGHLIGHT}Finished${CONSOLE_RESET} the Federal MP Data Pipeline in ${CONSOLE_HIGHLIGHT}${Date.now() - timeRetrieved}ms${CONSOLE_RESET}!`);

    }  
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not complete the Federal MP Data Pipeline. ${CONSOLE_RESET}`);
    throw error;
  }

}

runOntarioPipeline();