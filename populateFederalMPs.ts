import axios, { all } from "axios";
import { createObjectCsvWriter } from 'csv-writer';
const { XMLParser } = require("fast-xml-parser");

const baseURL = 'https://www.ourcommons.ca/members/en';

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

  const memberSearchURL = baseURL + '/search/xml';
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

createFederalMembersCSV()
