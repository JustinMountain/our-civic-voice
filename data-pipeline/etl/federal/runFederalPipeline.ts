import axios from 'axios';
import axiosRetry from 'axios-retry';
import { XMLParser } from 'fast-xml-parser';

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../config/constants';

import { RepInfo } from '../tableInterfaces';


import { scrapeFederalMPDataXML, 
  scrapeFederalMPPages, 
  scrapeFederalMPDataFromURLs } from "./extract/scrapeFederalMPs";
import { parseFederalXML, parseFederalPages } from "./transform/parseResponses";


const federalMemberSearchURL = `https://www.ourcommons.ca/members/en/search`;
const federalMemberSearchXML = `https://www.ourcommons.ca/members/en/search/xml`;
const timeRetrieved = Date.now();
const parser = new XMLParser();


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
  try {
    console.log(`Starting the Federal MP Data Pipeline.`)

    const federalMPXML = await scrapeFederalMPDataXML(axiosInstance, federalMemberSearchXML);
    const federalMPPages = await scrapeFederalMPPages(axiosInstance, federalMemberSearchURL);
    const federalMPDataFromURLs = await scrapeFederalMPDataFromURLs(axiosInstance, federalMPPages);

    const federalMPXMLData = await parseFederalXML(parser, federalMPXML);
    const federalMPPageData = await parseFederalPages(federalMPDataFromURLs);
    
    console.log(federalMPPageData);
    console.log(`${CONSOLE_HIGHLIGHT}Finished${CONSOLE_RESET} the Federal MP Data Pipeline in ${CONSOLE_HIGHLIGHT}${Date.now() - timeRetrieved}ms${CONSOLE_RESET}!`);

  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not scrape Federal data. ${CONSOLE_RESET}`);
    throw error;
  }

}

runFederalPipeline();
