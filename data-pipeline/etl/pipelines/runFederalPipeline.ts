import axios from 'axios';
import axiosRetry from 'axios-retry';
import { XMLParser } from 'fast-xml-parser';

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../config/constants';
import { FED_MEMBER_INFO_DIRECTORY, FED_MEMBER_OFFICE_DIRECTORY } from '../config/constants';

import { scrapeFederalMPDataXML, 
  scrapeFederalMPPages, 
  scrapeFederalMPDataFromURLs } from "../extract/federal/scrapeFederalMPs";

import { parseFederalXML, parseFederalPages } from "../transform/federal/parseResponses";

import { standardizeFederalMPInfo, standardizeFederalMPOfficeInfo } from "../transform/federal/standardizeParsedResponses";

import { createMembersCSV, createMemberOfficeCSV } from "../load/memoryToCSV";

import { handleCSVUpdateConditions } from '../config/utilities';

import { initFederalTablePopulation } from '../load/federal/initFederalTablePopulation';

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
  
export async function runFederalPipeline(): Promise<Boolean> {
  const timeRetrieved = Date.now();
  const parser = new XMLParser();

  try {
    console.log(`Starting the Federal MP Data Pipeline.`)

    // Scrapers
    const federalMPXML = await scrapeFederalMPDataXML(axiosInstance);
    const federalMPPages = await scrapeFederalMPPages(axiosInstance);
    const federalMPDataFromURLs = await scrapeFederalMPDataFromURLs(axiosInstance, federalMPPages);

    // Parse scraped data to memory
    const federalMPXMLData = await parseFederalXML(parser, federalMPXML);
    const federalMPPageData = await parseFederalPages(federalMPDataFromURLs);

    // Transform parsed data to standardized format
    const standardizedRepInfo = standardizeFederalMPInfo(federalMPPageData, federalMPXMLData);
    const standardizedOfficeInfo = standardizeFederalMPOfficeInfo(federalMPPageData);


    // Creates CSV from standardized data
    const createdMemberCSV = await createMembersCSV('federal', FED_MEMBER_INFO_DIRECTORY, standardizedRepInfo);
    const createdOfficeCSV = await createMemberOfficeCSV('federal', FED_MEMBER_OFFICE_DIRECTORY, standardizedOfficeInfo);

    // Checks created CSV files for updates
    let isFederalRepCSVUpdated: Boolean = false;
    let isFederalOfficeCSVUpdated: Boolean = false;
    if (createdMemberCSV) {
      isFederalRepCSVUpdated = await handleCSVUpdateConditions(FED_MEMBER_INFO_DIRECTORY);
    }
    if (createdOfficeCSV) {
      isFederalOfficeCSVUpdated = await handleCSVUpdateConditions(FED_MEMBER_OFFICE_DIRECTORY);
    }

    // If either table was updated, re-initialize them
    if (isFederalRepCSVUpdated || isFederalOfficeCSVUpdated) {
      await initFederalTablePopulation();
    }  
    console.log(`${CONSOLE_HIGHLIGHT}Finished${CONSOLE_RESET} the Federal MP Data Pipeline in ${CONSOLE_HIGHLIGHT}${Date.now() - timeRetrieved}ms${CONSOLE_RESET}!`);
    return true;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not complete the Federal MP Data Pipeline. ${CONSOLE_RESET}`);
    throw error;
  }
}
