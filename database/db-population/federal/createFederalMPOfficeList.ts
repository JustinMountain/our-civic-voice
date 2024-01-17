import axios from "axios";
import { AxiosInstance } from "axios";
import axiosRetry from 'axios-retry';
import { createObjectCsvWriter } from 'csv-writer';
import * as cheerio from "cheerio";

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
}

const baseURL = 'https://www.ourcommons.ca';
const memberSearchURL = `${baseURL}/members/en/search/xml`;
const memberCSVFilepath = './database/csv-sources/federal/member-info/';
const axiosInstance = axios.create();

// Setup axios retry for status code 5xx and Network errors
axiosRetry(axiosInstance, {
  retries: 5,
  retryDelay: (retryCount) => { return retryCount * 1000},
  onRetry: (count, err, req) => { console.log(`retry attempt #${count} got ${err}`); },
  retryCondition: axiosRetry.isNetworkOrIdempotentRequestError, 
})  

async function fetchFederalMPOfficeData(axiosInstance: AxiosInstance): Promise<any> {}
function parseFederalMPOfficeData(parser: XMLParser, axiosResponse: any, timeRetrieved: number): MemberData[] {}
async function createFederalMPOfficeCSV(parser: XMLParser, axiosInstance: AxiosInstance, csvFilepath: string) {}
export async function runFederalMPOfficeScraperToCSV() {}

// Scrapes federal MP contact info from the Parliament of Canada website and outputs it to a CSV file
export async function createFederalMPContactInfoCSV() {
  const memberSearchURL = baseURL + '/members/en/search';
  const timeRetrieved = Date.now();
  const allMembersPage = await axios.get(memberSearchURL);
  const selector = cheerio.load(allMembersPage.data);
  const data: MemberContactData[] = [];

  console.log('Searching for Federal MPs...')

  // Search for all member URLs from search page
  const memberURLs = selector(".ce-mip-mp-tile-container > a").map((i, el) => {
    return selector(el).attr("href")
  }).get();

  // Gather page data for all MPs
  const allMemberPageData = await Promise.all(memberURLs.map(async (url) => { 
    const memberURL = baseURL + url;
    const response = await axios.get(memberURL);
    return { url: memberURL, data: response.data };
  }));

  console.log('Processing Federal MP contact info...')

  // Loop over each member, adding data to CSV
  for (const oneMember of allMemberPageData) {
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

      // Create MemberContactData object for this office
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
      };
  
      data.push(thisMember);
    }

    // Retrieve Constituency Office contact info
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
        const address = thisOfficeAddress.split('<br>')
        const cityAndProvince = address[2].trim().split(', ')
        officeAddress = address[1].trim()
        officeCity = cityAndProvince[0].trim()

        if (cityAndProvince[1]) {
          officeProvince = cityAndProvince[1].trim()
        }

        officePostalCode = address[3].trim()
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

      // Create MemberContactData object for this office
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
      };
  
      data.push(thisMember);
    }
  }

  // Create CSV from scraped data
  const fileName = `${timeRetrieved}-federal-mp-contact-info`
  const csvWriter = createObjectCsvWriter({
    path: `./database/csv-sources/federal/contact-info/${fileName}.csv`,
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
    ]
  });

  // Write CSV and notify user
  csvWriter.writeRecords(data)
    .then(() => console.log(`Processed all contact info in ${Date.now() - timeRetrieved}ms to ${fileName}.csv`));
}

