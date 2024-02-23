import axios from 'axios';
import axiosRetry from 'axios-retry';

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../config/constants';
import { ONT_CSV_SOURCE, ONT_MEMBER_SOURCE_DIRECTORY, ONT_MEMBER_INFO_DIRECTORY, ONT_MEMBER_OFFICE_DIRECTORY } from '../config/constants';

import { downloadOntarioMPPCSV } from '../extract/ontario/downloadOntarioCSV';
import { parseOntarioCSV, parseOntarioPages } from '../transform/ontario/parseResponses';
import { handleCSVUpdateConditions } from '../config/utilities';

import { scrapeOntarioMPPs, scrapeOntarioMPPDataFromURLs } from '../extract/ontario/scrapeOntarioMPPs';

import { standardizeOntarioMPPInfo, standardizeOntarioMPPOfficeInfo } from '../transform/ontario/standardizeParsedResponses';

import { createMembersCSV, createMemberOfficeCSV } from '../load/memoryToCSV';

import { initOntarioTablePopulation } from '../load/ontario/initOntarioTablePopulation';

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
  

export async function runOntarioPipeline() {
  const timeRetrieved = Date.now();

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
      const createdMemberCSV = await createMembersCSV('ontario', ONT_MEMBER_INFO_DIRECTORY, standardizedMPPData);
      const createdOfficeCSV = await createMemberOfficeCSV('ontario', ONT_MEMBER_OFFICE_DIRECTORY, standardizedMPPOfficeData);

      // Checks created CSV files for updates
      let isOntarioMemberCSVUpdated: Boolean = false;
      let isOntarioOfficeCSVUpdated: Boolean = false;

      if (createdMemberCSV) {
        isOntarioMemberCSVUpdated = await handleCSVUpdateConditions(ONT_MEMBER_SOURCE_DIRECTORY);
      }
      if (createdOfficeCSV) {
        isOntarioOfficeCSVUpdated = await handleCSVUpdateConditions(ONT_MEMBER_SOURCE_DIRECTORY);
      }
    
      // If either table was updated, re-initialize them
      if (isOntarioMemberCSVUpdated || isOntarioOfficeCSVUpdated) {
        await initOntarioTablePopulation(standardizedMPPData, standardizedMPPOfficeData);
      }  

      console.log(`${CONSOLE_HIGHLIGHT}Finished${CONSOLE_RESET} the Ontario MPP Data Pipeline in ${CONSOLE_HIGHLIGHT}${Date.now() - timeRetrieved}ms${CONSOLE_RESET}!`);
    }  
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not complete the Federal MP Data Pipeline. ${CONSOLE_RESET}`);
    throw error;
  }
}
