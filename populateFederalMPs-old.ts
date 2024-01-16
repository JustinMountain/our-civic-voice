// Scrape to CSV

import axios from "axios";
import axiosRetry from 'axios-retry';
import * as cheerio from "cheerio";
import { createObjectCsvWriter } from 'csv-writer';

const baseURL = 'https://www.ourcommons.ca';
const memberSearchURL = baseURL + '/members/en/search';

async function processMembers() {
  const listOfURLs = await axios.get(memberSearchURL);
  const selector = cheerio.load(listOfURLs.data);

  // Search for all member URLs for parsing
  console.log('Searching for Federal MPs...')
  const memberURLs = selector(".ce-mip-mp-tile-container>a").map((i, el) => {
    return selector(el).attr("href");
  }).get();

  console.log('\nProcessing Federal MPs...')

  // Setup axios retry for status code 5xx and Network errors
  axiosRetry(axios, {
    retries: 5,
    retryDelay: (retryCount) => { return retryCount * 1000},
    onRetry: (count, err, req) => { console.log(`retry attempt #${count} got ${err}`); },
    retryCondition: axiosRetry.isNetworkOrIdempotentRequestError, 
  })  

  const startGather = Date.now();
  // Gather page data for all MPs
  const allMemberPageData = await Promise.all(memberURLs.map(async (url) => { 
    const memberURL = baseURL + url;
    return axios.get(memberURL) 
  }));

  console.log('\nProcessing Federal MP data...')




  // Below is how I handle moving data into CSV... move out to separate function for readability
    // Start by actually going to the XML file



  // Hold the data in a meaningful way
  interface Data {
    // id: number;
    name: string;
    // email: string;
  }

  const data: Data[] = [];

  // Loop over each member, adding data to CSV
  for (const oneMember of allMemberPageData) {
    const selector = cheerio.load(oneMember.data);
    // console.log(selector("h1").first().text());
 
    const thisMember: Data = {
      // id: 0,
      name: selector("h1").first().text(),
      // email: ''
    };

    data.push(thisMember);
  }

  // Write CSV
  const csvWriter = createObjectCsvWriter({
    path: './db-sources/federal-mps/out.csv',
    header: [
      // { id: 'id', title: 'ID' },
      { id: 'name', title: 'NAME' },
      // { id: 'email', title: 'EMAIL' }
    ]
  });
  
  csvWriter.writeRecords(data)
    .then(() => console.log('Processed all: ' + allMemberPageData.length + ` MPs in ${Date.now() - startGather}ms to out.csv`));
}

processMembers();

// // XML Info
      // const { XMLParser } = require("fast-xml-parser");
      // import { readFileSync } from 'fs';

      // const xmlData = readFileSync('./testing/xml', 'utf-8');
      // const parser = new XMLParser();
      // let jsonObj = parser.parse(xmlData);

      // // This jsonObj also contains the committee/membership info needed later
      //   // Might also want to scrape for membership abbreviations and full names
      // // console.log(jsonObj.Profile);

      // // Honorific
      // const honorific = jsonObj.Profile.MemberOfParliamentRole.Honorific
      // // First Name
      // const firstName = jsonObj.Profile.MemberOfParliamentRole.PersonOfficialFirstName
      // // Last Name
      // const lastName = jsonObj.Profile.MemberOfParliamentRole.PersonOfficialLastName
      // // Constituency
      // const constituency = jsonObj.Profile.MemberOfParliamentRole.ConstituencyName
      // // Province / Territory
      // const provinceTerritory = jsonObj.Profile.MemberOfParliamentRole.ConstituencyProvinceTerritoryName
      // // Political Affiliation
      // const politicalAffiliation = jsonObj.Profile.MemberOfParliamentRole.CaucusShortName
      // // Start Date
      // const startDate = jsonObj.Profile.MemberOfParliamentRole.FromDateTime

      // console.log(honorific, firstName, lastName, constituency, provinceTerritory, politicalAffiliation, startDate)




// Scrape for contact info

// Need to find how many categories of offices there are 
  // Hill Office
  // Constituency Office(s)




// CSV needs all info above, plus office type (one for each contact office listed), then office info


