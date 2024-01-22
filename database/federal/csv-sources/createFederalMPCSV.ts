import axios from 'axios';
import { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { createObjectCsvWriter } from 'csv-writer';
import { XMLParser } from 'fast-xml-parser';

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../config/constants';
import { formatDateForFileName } from '../../config/csvUtilities';
import { checkForCSVUpdate } from '../../config/csvUtilities';

// Interface to hold data for individual members
interface MemberData {
  honorific: string;
  firstName: string;
  lastName: string;
  constituency: string;
  provinceTerritory: string;
  partyAffiliation: string;
  startDate: string;
  timeRetrieved: number;
}

const baseURL = 'https://www.ourcommons.ca';
const federalMemberSearchXML = `${baseURL}/members/en/search/xml`;
const timeRetrieved = Date.now();
const memberCSVFilepath = './database/federal/csv-sources/member-info/';
const fileName = `${formatDateForFileName(timeRetrieved)}-federal-mps.csv`;
const csvFilepath = `${memberCSVFilepath}${fileName}`;
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

/**
 * Runs the Federal MP scraper and creates a CSV file with the scraped data.
 * @returns True if the CSV file was created, false otherwise.
 */
export async function runFederalMPScraperToCSV(): Promise<Boolean> {
  console.log(`Starting the Federal MP Member scraper...`)
  try {
    const axiosResponse  = await fetchFederalMPData(axiosInstance);
    const data: MemberData[] = parseFederalMPData(parser, axiosResponse, timeRetrieved);  
    const isFileCreated = await createFederalMembersCSV(data, csvFilepath);

    if (isFileCreated) {
      const handled = await checkForCSVUpdate(memberCSVFilepath);
      console.log(`${CONSOLE_HIGHLIGHT}Federal MP Member scraper has completed!${CONSOLE_RESET}`);
      return handled;
    }
    return false;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Something went wrong running the Federal MP scraper. ${CONSOLE_RESET}`);
    throw error;
  }
}

/**
 * Helper function to fetch federal MP XML data from the Parliament of Canada website.
 * @param axiosInstance The axios instance to use for the request.
 * @returns The fetched federal MP data in XML format.
 */
async function fetchFederalMPData(axiosInstance: AxiosInstance): Promise<any> {
  console.log(`Fetching Federal MP data from ${federalMemberSearchXML}...`);
  try {
    return await axiosInstance.get(federalMemberSearchXML);
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not fetch Federal data: ${CONSOLE_RESET}`);
    throw error;
  }
}

/**
 * Helper function to parse the XML response from the Parliament of Canada website.
 * @param parser The XML parser to use.
 * @param axiosResponse The XML Data from the Parliament of Canada website.
 * @param timeRetrieved The time the data was retrieved.
 * @returns An array of MemberData objects, each representing a single MP found in the XML.
 */
function parseFederalMPData(parser: XMLParser, axiosResponse: any, timeRetrieved: number): MemberData[] {
  console.log('Parsing Federal MP data from retrieved XML...');
  const jsonObj = parser.parse(axiosResponse.data);
  const data: MemberData[] = [];

  for (const oneMember of jsonObj.ArrayOfMemberOfParliament.MemberOfParliament) {
    const thisMember: MemberData = {
      honorific: oneMember.PersonShortHonorific,
      firstName: oneMember.PersonOfficialFirstName,
      lastName: oneMember.PersonOfficialLastName,
      constituency: oneMember.ConstituencyName,
      provinceTerritory: oneMember.ConstituencyProvinceTerritoryName,
      partyAffiliation: oneMember.CaucusShortName,
      startDate: oneMember.FromDateTime,
      timeRetrieved: timeRetrieved
    };

    data.push(thisMember);
  }    
  return data;
}

/**
 * Helper function to create a CSV file from the scraped data.
 * @param data An array of MemberData objects.
 * @param csvFilepath The filepath to write the CSV file to.
 * @returns True if the CSV file was created, false otherwise.
 */
async function createFederalMembersCSV(data: MemberData[], csvFilepath: string): Promise<Boolean> {
  console.log('Writing Federal MP data to CSV...');
  try {
    // Create CSV from scraped data
    const csvWriter = createObjectCsvWriter({
      path: csvFilepath,
      header: [
        { id: 'honorific', title: 'honorific' },
        { id: 'firstName', title: 'first_name' },
        { id: 'lastName', title: 'last_name' },
        { id: 'constituency', title: 'constituency' },
        { id: 'provinceTerritory', title: 'province_territory' },
        { id: 'partyAffiliation', title: 'party_affiliation' },
        { id: 'startDate', title: 'start_date' },
        { id: 'timeRetrieved', title: 'time_retrieved' }
      ]
    });

    // Write CSV and notify user
    await csvWriter.writeRecords(data);
    console.log(
      `${CONSOLE_HIGHLIGHT}Processed all ${data.length} MPs${CONSOLE_RESET} to ${fileName} ${CONSOLE_HIGHLIGHT}in ${Date.now() - timeRetrieved}ms${CONSOLE_RESET}!`
    );    
    return true;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not write data${CONSOLE_RESET} to ${csvFilepath}. `);
    throw error;
  }
}

