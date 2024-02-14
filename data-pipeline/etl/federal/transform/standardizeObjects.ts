// import { XMLParser } from 'fast-xml-parser';
import { RepInfo } from '../../tableInterfaces';
import { OfficeInfo } from '../../tableInterfaces';

// import { scrapeFederalMPDataXML, 
//   scrapeFederalMPPages, 
//   scrapeFederalMPDataFromURLs } from "../extract/scrapeFederalMPs";

// const federalMPXML = await scrapeFederalMPDataXML(axiosInstance, federalMemberSearchXML);
// const federalMPPages = await scrapeFederalMPPages(axiosInstance, federalMemberSearchURL);
// const federalMPDataFromURLs = await scrapeFederalMPDataFromURLs(axiosInstance, federalMPPages);

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

// const memberId = extractNumber();







// export async function processFederalMPInfo(federalMPXML, federalMPPages, federalMPDataFromURLs): Promise<RepInfo[]> {

  // RepInfo {
  //   member_id: number;           extract from url
  //   time_retrieved: number;      Date.now()
  //   honorific: string;           extract from xml
  //   first_name: string;          extract from xml
  //   last_name: string;           extract from xml
  //   constituency: string;        extract from xml
  //   province_territory: string;  extract from xml
  //   party: string;               extract from xml
  //   email: string;               extract from page
  //   website: string;             extract from page
  //   image_url: string;           extract from page
  //   source_url: string;          url
  // }
  
// }


// export async function processFederalMPOfficeInfo(federalMPXML, federalMPPages, federalMPDataFromURLs): Promise<RepInfo[]> {
  // OfficeInfo {
  //   member_id: number;           extract from url  above
  //   time_retrieved: number;      Date.now()        above
  //   office_id: string;           serial
  //   office_type: string;         extract from page
  //   office_title: string;        extract from page
  //   office_address: string;      extract from page
  //   office_city: string;         extract from page
  //   office_province: string;     extract from page
  //   office_postal_code: string;  extract from page
  //   office_note: string;         extract from page
  //   office_telephone: string;    extract from page
  //   office_fax: string;          extract from page
  //   office_email: string;        extract from page
  //   office_toll_free: string;    extract from page
  //   office_tty: string;          extract from page
  //   source_url: string;          url
  // }
    
// }



// Functions that create each interface
// Parse the necessary info from each of three sources
