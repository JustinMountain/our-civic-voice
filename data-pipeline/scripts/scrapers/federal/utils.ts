import * as cheerio from "cheerio";
import { AxiosInstance } from 'axios';
import { CONSOLE_ERROR, CONSOLE_RESET } from '../../../config/constants';

const baseURL = 'https://www.ourcommons.ca';
const federalMemberSearchURL = `${baseURL}/members/en/search`;

/**
 * Represents data about a Federal member retrieved from XML.
 * @interface
 */
export interface FederalMemberData {
  honorific: string;
  firstName: string;
  lastName: string;
  constituency?: string;
  provinceTerritory: string;
  partyAffiliation: string;
  startDate: string;
  timeRetrieved: number;
}

/**
 * Represents data scraped from HTML about a Federal member.
 * @interface
 */
export interface ScrapedFederalMemberData {
  source?: (string | undefined);
  constituency?: string;
  member_id?: number;
}

/**
 * Represents the combined scraped and XML data about a Federal member.
 * @interface
 */
export interface MergedFederalMemberData {
  member_id: number;
  honorific: string;
  firstName: string;
  lastName: string;
  constituency?: string;
  provinceTerritory: string;
  partyAffiliation: string;
  startDate: string;
  timeRetrieved: number;
  source?: (string | undefined);
}

/**
 * Represents data about a Federal member's office.
 * @interface
 */
export interface FederalMemberContactData {
  member_id: number;
  name: string;
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

/**
 * 
 * @param axiosInstance The axios instance to use for the request.
 * @returns An array of FederalMemberData objects, each representing scraped info.
 */
export async function fetchFederalMPInfo(axiosInstance: AxiosInstance): Promise<ScrapedFederalMemberData[]> {
  console.log(`Fetching Federal MP URLs from  ${federalMemberSearchURL}...`);
  try {
    const allMembersPage = await axiosInstance.get(federalMemberSearchURL);
    const selector = cheerio.load(allMembersPage.data);

    const urlInfo: ScrapedFederalMemberData[] = [];

    selector(".ce-mip-mp-tile-container > a").map((i, el) => {
      const url = selector(el).attr("href");
      let id = 0;
      url ? id = extractNumber(url) : id = 0;

      const thisMember: ScrapedFederalMemberData = {
        source: url,
        constituency: selector(el).find(".ce-mip-mp-constituency").text().trim(),
        member_id: id,
      }
      urlInfo.push(thisMember);
    }).get();

    return urlInfo;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not fetch Federal URL data: ${CONSOLE_RESET}`);
    throw error;
  }
}

/**
 * Extracts a number from a string. Intended for use with URLs.
 * @param inputString The string to extract a number from.
 * @returns The number extracted from the string.
 */
export function extractNumber(inputString: string): number {
  // Regular expression to match digits inside parentheses
  const regex = /\((\d+)\)/;
  const match = inputString.match(regex);
  return match ? parseInt(match[1]) : 0;
}

/**
 * Merges the provided FederalMemberData and ScrapedFederalMemberData into an array of MergedFederalMemberData.
 * @param members FederalMemberData from XML as an array.
 * @param scraped Complimentary info not present in XML, scraped from the internet.
 * @returns An merged array of the provided data.
 */
export function mergeFederalMemberData(members: FederalMemberData[], scraped: ScrapedFederalMemberData[]): MergedFederalMemberData[] {
  // Create a map with constituency as key and FederalMemberData as value
  const memberMap = new Map<string, FederalMemberData>();
  members.forEach(member => {
    let constituency = "";
    member.constituency ? constituency = member.constituency : constituency = "";
    memberMap.set(constituency, member);
  });

  // Iterate over scraped data to merge
  return scraped
    .filter(s => s.constituency && memberMap.has(s.constituency)) // Filter out undefined constituencies or those not in the map
    .map(s => {
      const member = memberMap.get(s.constituency!);

      // Create a merged object based on MergedFederalMemberData interface
      const merged: MergedFederalMemberData = {
        member_id: s.member_id ?? 0,
        honorific: member!.honorific,
        firstName: member!.firstName,
        lastName: member!.lastName,
        constituency: member!.constituency,
        provinceTerritory: member!.provinceTerritory,
        partyAffiliation: member!.partyAffiliation,
        startDate: member!.startDate,
        timeRetrieved: member!.timeRetrieved,
        source: s.source,
      };
      return merged;
    });
}

