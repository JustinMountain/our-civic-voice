import * as cheerio from "cheerio";
import { AxiosInstance } from 'axios';
import { CONSOLE_ERROR, CONSOLE_RESET } from '../../../config/constants';

const baseURL = 'https://www.ourcommons.ca';
const federalMemberSearchURL = `${baseURL}/members/en/search`;

// Interfaces for Federal Representative Data
export interface MemberData {
  honorific: string;
  firstName: string;
  lastName: string;
  constituency?: string;
  provinceTerritory: string;
  partyAffiliation: string;
  startDate: string;
  timeRetrieved: number;
}

export interface ScrapedMemberData {
  source?: (string | undefined);
  constituency?: string;
  member_id?: number;
}

export interface MergedMemberData {
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

// Interfaces for Federal Office Data
export interface MemberContactData {
  member_id: number;
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


export async function fetchFederalMPURLs(axiosInstance: AxiosInstance): Promise<ScrapedMemberData[]> {
  console.log(`Fetching Federal MP URLs from  ${federalMemberSearchURL}...`);
  try {
    const allMembersPage = await axiosInstance.get(federalMemberSearchURL);
    const selector = cheerio.load(allMembersPage.data);

    const urlInfo: ScrapedMemberData[] = [];

    selector(".ce-mip-mp-tile-container > a").map((i, el) => {
      const url = selector(el).attr("href");
      let id = 0;
      url ? id = extractNumber(url) : id = 0;

      const thisMember: ScrapedMemberData = {
        source: url,
        constituency: selector(el).find(".ce-mip-mp-constituency").text().trim(),
        member_id: id,
      }
      urlInfo.push(thisMember);
      // return selector(el).attr("href")
    }).get();

    return urlInfo;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not fetch Federal URL data: ${CONSOLE_RESET}`);
    throw error;
  }
}

export function extractNumber(inputString: string): number {
  // Regular expression to match digits inside parentheses
  const regex = /\((\d+)\)/;
  const match = inputString.match(regex);
  return match ? parseInt(match[1]) : 0;
}

export function mergeMemberData(members: MemberData[], scraped: ScrapedMemberData[]): MergedMemberData[] {
  // Create a map with constituency as key and MemberData as value
  const memberMap = new Map<string, MemberData>();
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

      // Create a merged object based on MergedMemberData interface
      const merged: MergedMemberData = {
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

