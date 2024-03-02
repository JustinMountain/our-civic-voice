import { XMLParser } from 'fast-xml-parser';
import * as cheerio from "cheerio";

/**
 * Represents data about a Federal member retrieved from XML.
 * @interface
 */
export interface FederalMemberXMLData {
  honorific: string;
  firstName: string;
  lastName: string;
  constituency?: string;
  provinceTerritory: string;
  partyAffiliation: string;
}

/**
 * Represents data from a Federal member's page.
 * @interface
 */
export interface FederalMemberPageData {
  member_id: number;
  constituency?: string;
  name: string;
  email: string;
  website: string;
  officeType: string;
  officeTitle: string;
  officeAddress: string;
  officeCity: string;
  officeProvinceTerritory: string;
  officePostalCode: string;
  officeNote: string;
  officePhone: string;
  officeFax: string;
  image: string | undefined;
  source: string;
}

/**
 * Extracts a number from a string. Intended for use with URLs.
 * @param inputString The string to extract a number from.
 * @returns The number extracted from the string.
 */
function extractNumber(inputString: string): number {
  // Regular expression to match digits inside parentheses
  const regex = /\((\d+)\)/;
  const match = inputString.match(regex);
  return match ? parseInt(match[1]) : 0;
}

/**
 * Function to parse the XML response from the Parliament of Canada website.
 * @param parser The XML parser to use.
 * @param axiosInstance The axios instance to use for the request.
 * @returns An array of FederalMemberXML objects, each representing a single MP found in the XML.
 */
export function parseFederalXML(parser: XMLParser, axiosResponse: any): FederalMemberXMLData[] {
  console.log('Parsing Federal MP data from retrieved XML...');
  const jsonObj = parser.parse(axiosResponse.data);
  const data: FederalMemberXMLData[] = [];

  for (const oneMember of jsonObj.ArrayOfMemberOfParliament.MemberOfParliament) {
    const thisMember: FederalMemberXMLData = {
      honorific: oneMember.PersonShortHonorific.trim(),
      firstName: oneMember.PersonOfficialFirstName.trim(),
      lastName: oneMember.PersonOfficialLastName.trim(),
      constituency: oneMember.ConstituencyName.trim(),
      provinceTerritory: oneMember.ConstituencyProvinceTerritoryName.trim(),
      partyAffiliation: oneMember.CaucusShortName.trim(),
    };

    data.push(thisMember);
  }    
  return data;
}

/**
 * Function to parse the individual Federal MP contact pages.
 * @param axiosInstance The axios instance to use for the request.
 * @returns An array of FederalMemberPageData objects, each representing data scraped from a single MP's Parliament of Canada page.
 */
export function parseFederalPages(axiosResponse: any): FederalMemberPageData[] {
  console.log('Parsing Federal MP data from URL...');
  const data: FederalMemberPageData[] = [];

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

      const thisMember: FederalMemberPageData = {
        member_id: member_id,
        constituency: selector('.ce-mip-overview a').text().trim(),
        name: selector('h1').first().text().trim(),
        email: selector('#contact a:eq(0)').text().trim(),
        website: selector('#contact a:eq(1)').text().trim(),
        officeType: selector('#contact .row .col-md-3 > h4').text().trim(),
        officeTitle: selector('#contact .row .col-md-3 strong').first().text().trim(),
        officeAddress: '',
        officeCity: 'Ottawa',
        officeProvinceTerritory: 'Ontario',
        officePostalCode: 'K1A 0A6',
        officeNote: '* Mail may be sent postage-free to any member of Parliament.',
        officePhone: phoneNumber,
        officeFax: faxNumber,
        image: selector('.ce-mip-mp-picture-container img').attr('src'),
        source: oneMember.url,
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

          if (address[2] == address[address.length - 3]) {
            officeAddress = address[1].trim();
          } else {
            officeAddress = address[1].trim() + '\n' + address[2].trim();
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
  
        const thisMember: FederalMemberPageData = {
          member_id: member_id,
          constituency: selector('.ce-mip-overview a').text().trim(),
          name: selector('h1').first().text().trim(),
          email: selector('#contact a:eq(0)').text().trim(),
          website: selector('#contact a:eq(1)').text().trim(),
          officeType: 'Constituency Office',
          officeTitle: selector(`.ce-mip-contact-constituency-office:nth-of-type(${i}) strong`).text().trim(),
          officeAddress: officeAddress,
          officeCity: officeCity,
          officeProvinceTerritory: officeProvince,
          officePostalCode: officePostalCode,
          officeNote: '',
          officePhone: phoneNumber,
          officeFax: faxNumber,
          image: selector('.ce-mip-mp-picture-container img').attr('src'),
          source: oneMember.url,
        };
    
        data.push(thisMember);
      }
  
    }
  }
  // console.log(`${data}`);
  return data;
}
