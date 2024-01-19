import axios from "axios";
import { AxiosInstance } from "axios";
import axiosRetry from 'axios-retry';
import { createObjectCsvWriter } from 'csv-writer';
import * as cheerio from "cheerio";

import { formatDateForFileName } from '../csvUtilities';
import { consoleHighlight, consoleReset } from '../csvUtilities';
import { checkForCSVUpdate } from '../csvUtilities';

// Interface to hold data for one office of a member
interface MemberContactData {
  name: string;
  constituency: string;
  email: string;
  website: string;
  office_type: string;
  office_title: string;
  office_address: string;
  office_city: string;
  office_province: string;
  office_postal_code: string;
  office_note: string;
  office_phone: string;
  office_fax: string;
  source: string;
  timeRetrieved: number;
}

const baseURL = 'https://www.ourcommons.ca';
const federalMemberSearchURL = `${baseURL}/members/en/search`;
const timeRetrieved = Date.now();
const memberContactCSVFilepath = './database/csv-sources/federal/contact-info/';
const fileName = `${formatDateForFileName(timeRetrieved)}-federal-mps.csv`;
const csvFilepath = `${memberContactCSVFilepath}${fileName}`;
const axiosInstance = axios.create();
const batchSize = 30;

// Setup axios retry for status code 5xx and Network errors
axiosRetry(axiosInstance, {
  retries: 5,
  retryDelay: (retryCount) => { return retryCount * 1000},
  onRetry: (count, err, req) => { console.log(`retry attempt #${count} got ${err}`); },
  retryCondition: axiosRetry.isNetworkOrIdempotentRequestError, 
})  

export async function fetchFederalMPData(axiosInstance: AxiosInstance, federalMemberSearchURL: string): Promise<any> {
  console.log('Fetching Federal MP contact pages...')
  try {
    const allMembersPage = await axiosInstance.get(federalMemberSearchURL);
    const selector = cheerio.load(allMembersPage.data);
    const memberURLs = selector(".ce-mip-mp-tile-container > a").map((i, el) => {
      return selector(el).attr("href")
    }).get();

    const allMemberPageData = await fetchContactInfoInBatches(memberURLs, axiosInstance, batchSize);
    return allMemberPageData;

  } catch (error) {
    console.error(`Could not fetch data from ${federalMemberSearchURL}`);
    throw error;
  }
}

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

function parseFederalMPOfficeData(axiosResponse: any, timeRetrieved: number): MemberContactData[] {
  console.log('Parsing Federal MP contact pages...')
  const data: MemberContactData[] = [];

  for (const oneMember of axiosResponse) {
    const selector = cheerio.load(oneMember.data);

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
  return data;
}

async function createFederalMPOfficeCSV(data: MemberContactData[], csvFilepath: string): Promise<Boolean> {
  console.log('Writing Federal MP contact info to CSV...');

  try {
    // Create CSV from scraped data
    const csvWriter = createObjectCsvWriter({
      path: csvFilepath,
      header: [
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
      `Processed all MP contact info (${data.length} offices) to ${consoleHighlight}${fileName}${consoleReset} in ${Date.now() - timeRetrieved}ms\n`
    );   
    return true;
  } catch (error) {
    console.error(`Could not write data to ${csvFilepath}`);
    throw error;
  }
}

export async function runFederalMPOfficeScraperToCSV(): Promise<Boolean> {
  try {
    const axiosResponse  = await fetchFederalMPData(axiosInstance, federalMemberSearchURL);
    const data: MemberContactData[] = parseFederalMPOfficeData(axiosResponse, timeRetrieved);  
    const isFileCreated = await createFederalMPOfficeCSV(data, csvFilepath);

    if (isFileCreated) {
      return await checkForCSVUpdate(isFileCreated, memberContactCSVFilepath);
    }
    return false;
  } catch (error) {
    console.error(`error`);
    throw error;
  }
}
