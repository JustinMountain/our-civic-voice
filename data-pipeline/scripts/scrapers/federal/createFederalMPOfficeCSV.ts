import axios from "axios";
import { AxiosInstance } from "axios";
import axiosRetry from 'axios-retry';
import { createObjectCsvWriter } from 'csv-writer';
import * as cheerio from "cheerio";

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../../config/constants';
import { formatDateForFileName } from '../../../config/csvUtilities';
import { checkForCSVUpdate } from '../../../config/csvUtilities';
import { FED_MEMBER_CONTACT_DIRECTORY } from '../../../config/constants';
import { MemberContactData } from './utils';
import { extractNumber } from './utils';

const baseURL = 'https://www.ourcommons.ca';
const federalMemberSearchURL = `${baseURL}/members/en/search`;
const timeRetrieved = Date.now();
const fileName = `${formatDateForFileName(timeRetrieved)}-federal-mps.csv`;
const csvFilepath = `${FED_MEMBER_CONTACT_DIRECTORY}${fileName}`;
const axiosInstance = axios.create();
const batchSize = 30;

// Setup axios retry for status code 5xx and Network errors
axiosRetry(axiosInstance, {
  retries: 5,
  retryDelay: (retryCount) => { return retryCount * 1000},
  onRetry: (count, error, req) => { console.error(`${CONSOLE_ERROR}Retry attempt #${count}${CONSOLE_RESET} got ${error}`); },
  retryCondition: axiosRetry.isNetworkOrIdempotentRequestError, 
})  

/**
 * Runs the Federal MP Office scraper and creates a CSV file with the scraped data.
 * @returns True if the CSV file was created, false otherwise.
 */
export async function runFederalMPOfficeScraperToCSV(): Promise<Boolean> {
  console.log(`Starting the Federal MP Office scraper...`)
  try {
    const axiosResponse  = await fetchFederalMPData(axiosInstance, federalMemberSearchURL);
    const data: MemberContactData[] = parseFederalMPOfficeData(axiosResponse, timeRetrieved);  
    const isFileCreated = await createFederalMPOfficeCSV(data, csvFilepath);

    if (isFileCreated) {
      const handled = await checkForCSVUpdate(FED_MEMBER_CONTACT_DIRECTORY);
      console.log(`${CONSOLE_HIGHLIGHT}Federal MP Office scraper has completed!${CONSOLE_RESET}`);
      return handled;
    }
    return false;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Something went wrong running the Federal MP Office scraper. ${CONSOLE_RESET}`);
    throw error;
  }
}

/**
 * Helper function to fetch each federal MP's contact info.
 * @param axiosInstance The axios instance to use for the request.
 * @returns The fetched federal MP data as an Axios response object.
 */
async function fetchFederalMPData(axiosInstance: AxiosInstance, federalMemberSearchURL: string): Promise<any> {
  console.log(`Fetching Federal MP contact pages from ${federalMemberSearchURL}...`)
  try {
    const allMembersPage = await axiosInstance.get(federalMemberSearchURL);
    const selector = cheerio.load(allMembersPage.data);
    const memberURLs = selector(".ce-mip-mp-tile-container > a").map((i, el) => {
      return selector(el).attr("href")
    }).get();

    const allMemberPageData = await fetchContactInfoInBatches(memberURLs, axiosInstance, batchSize);
    return allMemberPageData;

  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not fetch Federal data. ${CONSOLE_RESET}`);
    throw error;
  }
}

/**
 * Helper function which fetches the contact info for batches of MPs.
 * @param urls The URLs to fetch.
 * @param axiosInstance The axios instance to use for the request.
 * @param batchSize The number of URLs to fetch at a time.
 * @returns The bulk contact info for each federal MP.
 */
async function fetchContactInfoInBatches(urls: string[], axiosInstance: AxiosInstance, batchSize: number): Promise<any> {
  let results: any[] = [];
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(async url => {
      const memberURL = `${baseURL}${url}`;
      const response = await axiosInstance.get(memberURL);
      return { url: memberURL, data: response.data };
    }));
    results = [...results, ...batchResults];
  }
  return results;
}

/**
 * Helper function to parse the Federal MP data from the Parliament of Canada website.
 * @param axiosResponse The Axios Response object containing the HTML data.
 * @param timeRetrieved The time the data was retrieved.
 * @returns An array of MemberContactData objects, each representing a single office of an MP.
 */
function parseFederalMPOfficeData(axiosResponse: any, timeRetrieved: number): MemberContactData[] {
  console.log('Parsing Federal MP data from URL...');
  const data: MemberContactData[] = [];

  for (const oneMember of axiosResponse) {
    const selector = cheerio.load(oneMember.data);
    const member_id = extractNumber(oneMember.url);

    // Retrieve Hill Office contact info
    if (selector('#contact .row .col-md-3 > h4').text() === 'Hill Office') {
      let phoneNumber = '';
      let faxNumber = '';

      const contactNumbers = selector('#contact .row .col-md-3 p:nth-of-type(2)').html();
      if (contactNumbers) {
        const phoneSplit = contactNumbers.split('<br>')

        if (phoneSplit[0]) {
          phoneNumber = phoneSplit[0].split(':')[1].trim()
          faxNumber = phoneSplit[1].split(':')[1].trim()
        }
      }

      const thisMember: MemberContactData = {
        member_id: member_id,
        name: selector('h1').first().text(),
        constituency: selector('.ce-mip-overview a').first().text(),
        email: selector('#contact a:eq(0)').text(),
        website: selector('#contact a:eq(1)').text(),
        office_type: selector('#contact .row .col-md-3 > h4').text(),
        office_title: selector('#contact .row .col-md-3 strong').first().text(),
        office_address: '',
        office_city: 'Ottawa',
        office_province: 'Ontario',
        office_postal_code: 'K1A 0A6',
        office_note: '* Mail may be sent postage-free to any member of Parliament.',
        office_phone: phoneNumber,
        office_fax: faxNumber,
        source: oneMember.url,
        timeRetrieved: timeRetrieved
      };
  
      data.push(thisMember);
    }

    // Retrieve Constituency Office contact info
    if (selector('#contact .col-md-9 .ce-mip-contact-constituency-office-container')) {
      const numberConstituencyOffices = selector('#contact .col-md-9 .ce-mip-contact-constituency-office-container').children('div').length;
    
      // Some MPs have multiple constituency offices, so we loop over each one
      for (let i = 1; i <= numberConstituencyOffices; i++) {
        const thisOfficeAddress = selector(`.ce-mip-contact-constituency-office:nth-of-type(${i}) p`).first().html();
        const thisOfficeContact = selector(`.ce-mip-contact-constituency-office:nth-of-type(${i}) p:nth-of-type(2)`).html();
        
        let officeAddress = '';
        let officeCity = '';
        let officeProvince = '';
        let officePostalCode = '';
        let phoneNumber = '';
        let faxNumber = '';
  
        if (thisOfficeAddress) {
          let address = thisOfficeAddress.split('<br>')

          officePostalCode = address[address.length - 2].trim();

          const cityAndProvince = address[address.length - 3].trim().split(', ');

          officeCity = cityAndProvince[0].trim();

          if (cityAndProvince[1]) {
            officeProvince = cityAndProvince[1].trim()
          }

          if (address.length == 1) {
            officeAddress = address[0].trim();
          }
          if (address.length == 2) {
            officeAddress = `${address[0].trim()} ${address[1].trim()}`;
          }
        }
  
        if (thisOfficeContact) {
          const phoneSplit = thisOfficeContact.split('<br>')
          if (phoneSplit[0]) {
            if (phoneSplit[0].split(':')[1]) {
              phoneNumber = phoneSplit[0].split(':')[1].trim()
            }
            if (phoneSplit[1].split(':')[1]) {
              faxNumber = phoneSplit[1].split(':')[1].trim()
            }
          }
        }
  
        const thisMember: MemberContactData = {
          member_id: member_id,
          name: selector('h1').first().text(),
          constituency: selector('.ce-mip-overview a').first().text(),
          email: selector('#contact a:eq(0)').text(),
          website: selector('#contact a:eq(1)').text(),
          office_type: 'Constituency Office',
          office_title: selector(`.ce-mip-contact-constituency-office:nth-of-type(${i}) strong`).text().trim(),
          office_address: officeAddress,
          office_city: officeCity,
          office_province: officeProvince,
          office_postal_code: officePostalCode,
          office_note: '',
          office_phone: phoneNumber,
          office_fax: faxNumber,
          source: oneMember.url,
          timeRetrieved: timeRetrieved
        };
    
        data.push(thisMember);
      }
  
    }
  }
  console.log(`${data}`);
  return data;
}

/**
 * Helper function to create a CSV file from the scraped data.
 * @param data An array of MemberContactData objects.
 * @param csvFilepath The filepath to write the CSV file to.
 * @returns True if the CSV file was created, false otherwise.
 */
async function createFederalMPOfficeCSV(data: MemberContactData[], csvFilepath: string): Promise<Boolean> {
  console.log('Writing Federal MP contact info to CSV...');

  try {
    // Create CSV from scraped data
    const csvWriter = createObjectCsvWriter({
      path: csvFilepath,
      header: [
        { id: 'member_id', title: 'member_id'},
        { id: 'name', title: 'name' },
        { id: 'constituency', title: 'constituency' },
        { id: 'email', title: 'email' },
        { id: 'website', title: 'website' },
        { id: 'office_type', title: 'office_type' },
        { id: 'office_title', title: 'office_title' },
        { id: 'office_address', title: 'office_address' },
        { id: 'office_city', title: 'office_city' },
        { id: 'office_province', title: 'office_province' },
        { id: 'office_postal_code', title: 'office_postal_code' },
        { id: 'office_note', title: 'office_note' },
        { id: 'office_phone', title: 'office_phone' },
        { id: 'office_fax', title: 'office_fax' },
        { id: 'source', title: 'source' },
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
