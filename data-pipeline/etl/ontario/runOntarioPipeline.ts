import axios from 'axios';
import axiosRetry from 'axios-retry';

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../constants';
import { ONT_CSV_SOURCE, ONT_MEMBER_SOURCE_DIRECTORY } from '../constants';

import { downloadOntarioMPPCSV } from './extract/downloadOntarioCSV';
import { parseOntarioCSV, parseOntarioPages } from './transform/parseResponses';
import { handleCSVUpdateConditions } from '../utilities';

import { scrapeOntarioMPPs, scrapeOntarioMPPDataFromURLs } from './extract/scrapeOntarioMPPs';

import { standardizeOntarioMPPInfo, standardizeOntarioMPPOfficeInfo } from './transform/standardizeParsedResponses';

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

  // const ontarioCSVData = await parseOntarioCSV(ONT_MEMBER_SOURCE_DIRECTORY);
  // console.log(ontarioCSVData);

  const ontarioMPPages = await scrapeOntarioMPPs(axiosInstance);
  const ontarioMPDataFromURLs = await scrapeOntarioMPPDataFromURLs(axiosInstance, ontarioMPPages);

  // Parse the scraped content into memory
  const ontarioPageData = await parseOntarioPages(ontarioMPDataFromURLs);

  // Parse the content of the source CSV file
  const ontarioCSVData = await parseOntarioCSV(ONT_MEMBER_SOURCE_DIRECTORY);

  // const standardizedMPPData = await standardizeOntarioMPPInfo(ontarioPageData, ontarioCSVData);
  const standardizedMPPOfficeData = await standardizeOntarioMPPOfficeInfo(ontarioPageData, ontarioCSVData);

  console.log(standardizedMPPOfficeData[0]);



  // Standardized LOAD functions
    // Need to check if they will load to CSV and DB as expected
    // Requires re-writing table definitions
    // Will also need to bring Federal up to these standards
    // Probably want to go etl/extract, etl/transform, ... structure instead now
      // With a separate folder for the pipelines


  // Getting close to being able to switch over to these standardized functions





  try {


    // Initiates downloading the Ontario CSV file
    const createdOntarioCSV = await downloadOntarioMPPCSV(axiosInstance, ONT_CSV_SOURCE, ONT_MEMBER_SOURCE_DIRECTORY);
    let isOntarioRepCSVUpdated: Boolean = false;

    // Checks if the CSV file is updated
    if (createdOntarioCSV) {
      isOntarioRepCSVUpdated = await handleCSVUpdateConditions(ONT_MEMBER_SOURCE_DIRECTORY);
    }

    // When the CSV file is updated, the pipeline continues
    if (isOntarioRepCSVUpdated) {

      // Scrape for remaining information
      const ontarioMPPages = await scrapeOntarioMPPs(axiosInstance);
      const ontarioMPDataFromURLs = await scrapeOntarioMPPDataFromURLs(axiosInstance, ontarioMPPages);
    
      // Parse the scraped data and CSV into memory
      const ontarioPageData = await parseOntarioPages(ontarioMPDataFromURLs);
      const ontarioCSVData = await parseOntarioCSV(ONT_MEMBER_SOURCE_DIRECTORY);
  
      // Transform parsed data to standardized format
      const standardizedMPPData = await standardizeOntarioMPPInfo(ontarioPageData, ontarioCSVData);
      const standardizedMPPOfficeData = await standardizeOntarioMPPOfficeInfo(ontarioPageData, ontarioCSVData);
    
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
