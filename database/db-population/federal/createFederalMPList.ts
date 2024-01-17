import axios from 'axios';
import { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { createObjectCsvWriter } from 'csv-writer';
import { XMLParser } from 'fast-xml-parser';

import { formatDateForFileName } from '../utilities';
import { consoleHighlight, consoleReset } from '../utilities';

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
const memberSearchURL = `${baseURL}/members/en/search/xml`;
const timeRetrieved = Date.now();
const fileName = formatDateForFileName(timeRetrieved);
const memberCSVFilepath = './database/csv-sources/federal/member-info/';
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
async function fetchFederalMPData(axiosInstance: AxiosInstance): Promise<any> {
  console.log('Fetching Federal MP data...');
  try {
    return await axiosInstance.get(memberSearchURL);
  } catch (error) {
    console.error(`Could not fetch data from ${memberSearchURL}`);
    throw error;
  }
}

// Parses the XML response from the Parliament of Canada website
function parseFederalMPData(parser: XMLParser, axiosResponse: any, timeRetrieved: number): MemberData[] {
  const jsonObj = parser.parse(axiosResponse.data);
  const data: MemberData[] = [];

  console.log('Parsing Federal MP data...');
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
async function createFederalMembersCSV(parser: XMLParser, axiosInstance: AxiosInstance, csvFilepath: string) {
  const axiosResponse  = await fetchFederalMPData(axiosInstance);
  const data = parseFederalMPData(parser, axiosResponse, timeRetrieved);

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

export async function runFederalMPScraperToCSV() {
  try {
    await createFederalMembersCSV(parser, axiosInstance, csvFilepath);
  } catch (error) {
    console.error(`error`);
    throw error;
  }
}
