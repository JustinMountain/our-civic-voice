import { AxiosInstance } from 'axios';
import * as cheerio from "cheerio";

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../../config/constants';

/**
 * Helper function to scrape federal MP XML data from the Parliament of Canada website.
 * @param axiosInstance The axios instance to use for the request.
 * @returns Promise of the scraped federal MP data in XML format.
 */
export async function scrapeFederalMPDataXML(axiosInstance: AxiosInstance, federalMemberSearchXML: string): Promise<any> {
  console.log(`Scraping Federal MP data from ${federalMemberSearchXML}...`);
  try {
    const res = await axiosInstance.get(federalMemberSearchXML);
    console.log(`${CONSOLE_HIGHLIGHT}Finished${CONSOLE_RESET} scraping Federal MP data from ${federalMemberSearchXML}.`);
    return res;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not scrape Federal data. ${CONSOLE_RESET}`);
    throw error;
  }
}

/**
 * Helper function to scrape each federal MP's URL.
 * @param axiosInstance The axios instance to use for the request.
 * @returns An array containing each member's URL.
 */
export async function scrapeFederalMPPages(axiosInstance: AxiosInstance, federalMemberSearchURL: string): Promise<string[]> {
  console.log(`Scraping Federal MP contact pages from ${federalMemberSearchURL}...`)
  try {
    const allMembersPage = await axiosInstance.get(federalMemberSearchURL);
    const selector = cheerio.load(allMembersPage.data);
    const memberURLs = selector(".ce-mip-mp-tile-container > a").map((i, el) => {
      return selector(el).attr("href")
    }).get();

    console.log(`${CONSOLE_HIGHLIGHT}Finished${CONSOLE_RESET} scraping Federal MP contact pages from ${federalMemberSearchURL}.`);
    return memberURLs;

  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not scrape Federal data. ${CONSOLE_RESET}`);
    throw error;
  }
}

/**
 * Helper function to scrape each federal MP's contact page.
 * @param axiosInstance The axios instance to use for the request.
 * @returns The scrapeed federal MP page data as an Axios response object.
 */
export async function scrapeFederalMPDataFromURLs(axiosInstance: AxiosInstance, memberURLs: string[]): Promise<any> {
  console.log(`Scraping individial Federal MP contact pages...`)
  try {
    return await scrapeContactInfoInBatches(memberURLs, axiosInstance);
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not scrape Federal data. ${CONSOLE_RESET}`);
    throw error;
  }
}

/**
 * Helper function used for scraping batches of MPs.
 * @param urls The URLs to scrape.
 * @param axiosInstance The axios instance to use for the request.
 * @param batchSize The number of URLs to scrape at a time.
 * @returns The bulk contact info for each federal MP.
 */
async function scrapeContactInfoInBatches(memberURLs: string[], axiosInstance: AxiosInstance): Promise<any> {
  const baseURL = 'https://www.ourcommons.ca';
  const batchSize = 30;

  let results: any[] = [];

  try {
    for (let i = 0; i < memberURLs.length; i += batchSize) {
      const batch = memberURLs.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(async url => {
        const memberURL = `${baseURL}${url}`;
        const response = await axiosInstance.get(memberURL);
        return { url: memberURL, data: response.data };
      }));
      results = [...results, ...batchResults];
    }
    return results;
  
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Error during batch scraping for member info. ${CONSOLE_RESET}`);
    throw error;
  }
}
