import axios from 'axios';
import { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { createObjectCsvWriter } from 'csv-writer';
import { XMLParser } from 'fast-xml-parser';

import { formatDateForFileName } from '../csvUtilities';
import { consoleHighlight, consoleReset } from '../csvUtilities';

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
const memberCSVFilepath = './database/csv-sources/federal/member-info/';
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
  onRetry: (count, err, req) => { console.log(`retry attempt #${count} got ${err}`); },
  retryCondition: axiosRetry.isNetworkOrIdempotentRequestError, 
})  

// Fetches federal MP data from the Parliament of Canada website
export async function fetchFederalMPData(axiosInstance: AxiosInstance): Promise<any> {
  console.log('Fetching Federal MP data...');
  try {
    return await axiosInstance.get(federalMemberSearchXML);
  } catch (error) {
    console.error(`Could not fetch data from ${federalMemberSearchXML}`);
    throw error;
  }
}

// Parses the XML response from the Parliament of Canada website
function parseFederalMPData(parser: XMLParser, axiosResponse: any, timeRetrieved: number): MemberData[] {
  console.log('Parsing Federal MP data...');
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

// Creates CSV file from the scraped data
async function createFederalMembersCSV(data: MemberData[], csvFilepath: string) {
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
      `Processed all ${data.length} MPs to ${consoleHighlight}${fileName}${consoleReset} in ${Date.now() - timeRetrieved}ms\n`
    );    
  } catch (error) {
    console.error(`Could not write data to ${csvFilepath}`);
    throw error;
  }
}

export async function runFederalMPScraperToCSV(): Promise<Boolean> {
  try {
    const axiosResponse  = await fetchFederalMPData(axiosInstance);
    const data: MemberData[] = parseFederalMPData(parser, axiosResponse, timeRetrieved);  
    await createFederalMembersCSV(data, csvFilepath);
    return true;
  } catch (error) {
    console.error(`error`);
    throw error;
  }
}
