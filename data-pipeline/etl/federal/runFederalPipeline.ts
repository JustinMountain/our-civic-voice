import axios from 'axios';
import axiosRetry from 'axios-retry';
import { XMLParser } from 'fast-xml-parser';

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../config/constants';

import { scrapeFederalMPDataXML, 
  scrapeFederalMPPages, 
  scrapeFederalMPDataFromURLs } from "./extract/scrapeFederalMPs";

import { parseFederalXML, parseFederalPages } from "./transform/parseResponses";

import { standardizeFederalMPInfo, standardizeFederalMPOfficeInfo } from "./transform/standardizeParsedResponses";

import { createFederalMembersCSV, createFederalMemberOfficeCSV } from "./load/memoryToCSV";

import { dropAllFederalTables, populateFederalMemberTable, populateFederalOfficeTable } from "./load/memoryToPostgres";

import { standardizeFederalRepCSVResponse } from "./transform/csvToMemory";

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
  



async function runFederalPipeline() {
  const federalMemberSearchURL = `https://www.ourcommons.ca/members/en/search`;
  const federalMemberSearchXML = `https://www.ourcommons.ca/members/en/search/xml`;
  const timeRetrieved = Date.now();
  const parser = new XMLParser();

  try {
    console.log(`Starting the Federal MP Data Pipeline.`)

    // Scrapers
    // const federalMPXML = await scrapeFederalMPDataXML(axiosInstance, federalMemberSearchXML);
    // const federalMPPages = await scrapeFederalMPPages(axiosInstance, federalMemberSearchURL);
    // const federalMPDataFromURLs = await scrapeFederalMPDataFromURLs(axiosInstance, federalMPPages);

    // Parse scraped data to memory
    // const federalMPXMLData = await parseFederalXML(parser, federalMPXML);
    // const federalMPPageData = await parseFederalPages(federalMPDataFromURLs);

    // Transform parsed data to standardized format
    // const standardizedRepInfo = standardizeFederalMPInfo(federalMPPageData, federalMPXMLData);
    // const standardizedOfficeInfo = standardizeFederalMPOfficeInfo(federalMPPageData);

    // Creates CSV from standardized data
    // const createdFederalRepCSV = await createFederalMembersCSV(standardizedRepInfo);
    // const createdFederalRepOfficeCSV = await createFederalMemberOfficeCSV(standardizedOfficeInfo);

    // Populates the database with the standardized data
    await dropAllFederalTables();
    // const populatedFederalRepPG = await populateFederalMemberTable(standardizedRepInfo);
    // const populatedFederalOfficePG = await populateFederalOfficeTable(standardizedOfficeInfo);

    const res = await standardizeFederalRepCSVResponse();
    const populatedFederalRepPG = await populateFederalMemberTable(res);

    console.log(`${CONSOLE_HIGHLIGHT}Finished${CONSOLE_RESET} the Federal MP Data Pipeline in ${CONSOLE_HIGHLIGHT}${Date.now() - timeRetrieved}ms${CONSOLE_RESET}!`);

  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not complete the Federal MP Data Pipeline. ${CONSOLE_RESET}`);
    throw error;
  }
}

runFederalPipeline();
