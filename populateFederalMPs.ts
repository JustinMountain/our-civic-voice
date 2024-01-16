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
        path: `./db-sources/federal-mps/${fileName}.csv`,
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
  // const allMemberPageData = await Promise.all(memberURLs.map(async (url) => { 
  //   const memberURL = baseURL + url;
  //   const response = await axios.get(memberURL);
  //   return { url: memberURL, data: response.data };
  // }));

  // Gather page data for all MPs
  const someMemberPageData = await Promise.all(someMemberURLs.map(async (url) => { 
    const memberURL = baseURL + url;
    const response = await axios.get(memberURL);
    return { url: memberURL, data: response.data };
  }));
  
  // console.log(allMemberPageData)

  console.log('Processing Federal MPs contact info...')

  // Hold the data in a meaningful way
  interface MemberContactData {
    // office_id: number;
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
  for (const oneMember of someMemberPageData) {
    const selector = cheerio.load(oneMember.data);

    // Will need something like this for constituency offices
    // let textLines = '';
    // let postalCode: string | undefined = '';

    // const addressPTag = selector('#contact .row .col-md-3 p:nth-of-type(1)').html();
    // if (addressPTag) {
    //   const textLines = addressPTag.split('<br>').map(line => line.trim());
    //   console.log(textLines)

    //   postalCode = textLines.find(line => /^[A-Z]\d[A-Z] \d[A-Z]\d$/.test(line));
    //   if (postalCode === undefined) {
    //     postalCode = '';
    //   }
    // }
    
    // Retrieve Hill Office contact info
    if (selector('#contact .row .col-md-3 > h4').text() === 'Hill Office') {

      let phoneNumber = '';
      let faxNumber = '';

      const contactNumbers = selector('#contact .row .col-md-3 p:nth-of-type(2)').html();
      if (contactNumbers) {
        const phoneSplit = contactNumbers.split('<br>')
        // console.log(phoneSplit[0].trim())
        // console.log(phoneSplit[1].trim())

        if (phoneSplit[0]) {
          phoneNumber = phoneSplit[0].split(':')[1].trim()
          faxNumber = phoneSplit[1].split(':')[1].trim()
        }

        // console.log(phoneSplit)
      }

      const thisMember: MemberContactData = {
        // id: 0,
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

  }

  console.log(data)
  console.log(data.length)
  
  console.log(`Processed all contact info in ${Date.now() - timeRetrieved}ms`)  
}


// createFederalMembersCSV()
createFederalMPContactInfoCSV()
