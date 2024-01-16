import axios, { all } from "axios";
import axiosRetry from 'axios-retry';
import { createObjectCsvWriter } from 'csv-writer';
const { XMLParser } = require("fast-xml-parser");
import * as cheerio from "cheerio";

const baseURL = 'https://www.ourcommons.ca';

// Scrapes federal MP data from the Parliament of Canada website and outputs it to a CSV file
async function createFederalMembersCSV() {
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

  const memberSearchURL = baseURL + '/members/en/search/xml';
  const parser = new XMLParser();
  const timeRetrieved = Date.now();
  const data: MemberData[] = [];

  console.log('\nProcessing Federal MP data...');

  axios.get(memberSearchURL, { responseType: 'document' })
    .then(response => {
      // Axios request was for an XML object, so we parse the data of the response object
      const jsonObj = parser.parse(response.data);

      // Loops over each member and adds their data to the data array
      for (const oneMember of jsonObj.ArrayOfMemberOfParliament.MemberOfParliament) {
        // Utilize the MemberData interface to hold the data for each member
        const thisMember: MemberData = {
          honorific: oneMember.PersonShortHonorific, // Honorific
          firstName: oneMember.PersonOfficialFirstName, // First Name
          lastName: oneMember.PersonOfficialLastName, // Last Name
          constituency: oneMember.ConstituencyName, // Constituency
          provinceTerritory: oneMember.ConstituencyProvinceTerritoryName, // Province / Territory
          partyAffiliation: oneMember.CaucusShortName, // Political Affiliation
          startDate: oneMember.FromDateTime, // Start Date
          timeRetrieved: timeRetrieved
        };

        data.push(thisMember);
      }

      // Create CSV from scraped data
      const fileName = `${timeRetrieved}-federal-mps`
      const csvWriter = createObjectCsvWriter({
        path: `./db-sources/federal-mps/member-info/${fileName}.csv`,
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
      csvWriter.writeRecords(data)
        .then(() => console.log('Processed all ' + data.length + ` MPs in ${Date.now() - timeRetrieved}ms to ${fileName}.csv`));
    })
    .catch(error => {
      // Handle error
      console.error(error);
    }
  );
}

async function createFederalMPContactInfoCSV() {
  const memberSearchURL = baseURL + '/members/en/search';
  const allMembersPage = await axios.get(memberSearchURL);
  const selector = cheerio.load(allMembersPage.data);
  const timeRetrieved = Date.now();

  // Search for all member URLs for parsing
  console.log('Searching for Federal MPs...')

  const memberURLs = selector(".ce-mip-mp-tile-container>a").map((i, el) => {
    return selector(el).attr("href")
  }).get();

  const someMemberURLs = memberURLs.slice(0, 3);
  // console.log(someMemberURLs)

  // Setup axios retry for status code 5xx and Network errors
  axiosRetry(axios, {
    retries: 5,
    retryDelay: (retryCount) => { return retryCount * 1000},
    onRetry: (count, err, req) => { console.log(`retry attempt #${count} got ${err}`); },
    retryCondition: axiosRetry.isNetworkOrIdempotentRequestError, 
  })  
  
  // Gather page data for all MPs
  const allMemberPageData = await Promise.all(memberURLs.map(async (url) => { 
    const memberURL = baseURL + url;
    const response = await axios.get(memberURL);
    return { url: memberURL, data: response.data };
  }));

  console.log('Processing Federal MPs contact info...')

  // Hold the data in a meaningful way
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

  const data: MemberContactData[] = [];

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
    path: `./db-sources/federal-mps/contact-info/${fileName}.csv`,
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

createFederalMembersCSV()
createFederalMPContactInfoCSV()
