import { AxiosInstance } from 'axios';
import * as cheerio from "cheerio";

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../constants';
import { FED_BASE_URL, FED_SEARCH_URL, FED_SEARCH_XML } from '../../constants';

import { scrapeContactInfoInBatches } from '../../utilities';

/**
 * Function to scrape federal MP XML data from the Parliament of Canada website.
 * @param axiosInstance The axios instance to use for the request.
 * @returns Promise of the scraped federal MP data in XML format.
 */
export async function scrapeFederalMPDataXML(axiosInstance: AxiosInstance): Promise<any> {
  console.log(`Scraping Federal MP data from ${FED_SEARCH_XML}...`);
  try {
    const res = await axiosInstance.get(FED_SEARCH_XML);
    console.log(`${CONSOLE_HIGHLIGHT}Finished${CONSOLE_RESET} scraping Federal MP data from ${FED_SEARCH_XML}.`);
    return res;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not scrape Federal data. ${CONSOLE_RESET}`);
    throw error;
  }
}

/**
 * Function to scrape each federal MP's URL.
 * @param axiosInstance The axios instance to use for the request.
 * @returns An array containing each member's URL.
 */
export async function scrapeFederalMPPages(axiosInstance: AxiosInstance): Promise<string[]> {
  console.log(`Scraping Federal MP contact pages from ${FED_SEARCH_URL}...`)
  try {
    const allMembersPage = await axiosInstance.get(FED_SEARCH_URL);
    const selector = cheerio.load(allMembersPage.data);
    const memberURLs = selector(".ce-mip-mp-tile-container > a").map((i, el) => {
      return selector(el).attr("href")
    }).get();

    console.log(`${CONSOLE_HIGHLIGHT}Finished${CONSOLE_RESET} scraping Federal MP contact pages from ${FED_SEARCH_URL}.`);
    return memberURLs;

  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not scrape Federal data. ${CONSOLE_RESET}`);
    throw error;
  }
}

/**
 * Function to scrape each federal MP's contact page.
 * @param axiosInstance The axios instance to use for the request.
 * @returns The scrapeed federal MP page data as an Axios response object.
 */
export async function scrapeFederalMPDataFromURLs(axiosInstance: AxiosInstance, memberURLs: string[]): Promise<any> {
  console.log(`Scraping individial Federal MP contact pages...`)
  try {
    return await scrapeContactInfoInBatches(FED_BASE_URL, memberURLs, axiosInstance);
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not scrape Federal data. ${CONSOLE_RESET}`);
    throw error;
  }
}
