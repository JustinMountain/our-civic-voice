import { AxiosInstance } from 'axios';
import * as cheerio from "cheerio";

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../constants';
import { ONT_BASE_URL, ONT_SCRAPE_SOURCE } from '../../constants';

import { scrapeContactInfoInBatches } from '../../utilities';

/**
 * Function to scrape each Ontario MPP's URL.
 * @param axiosInstance The axios instance to use for the request.
 * @returns An array containing each member's URL.
 */
export async function scrapeOntarioMPPs(axiosInstance: AxiosInstance): Promise<string[]> {
  console.log(`Scraping Federal MP contact pages from ${ONT_SCRAPE_SOURCE}...`)
  try {
    const allMembersPage = await axiosInstance.get(ONT_SCRAPE_SOURCE);
    const selector = cheerio.load(allMembersPage.data);
    const memberURLs = selector(".stretched-link").map((i, el) => {
      return selector(el).attr("href")
    }).get();

    console.log(`${CONSOLE_HIGHLIGHT}Finished${CONSOLE_RESET} scraping Ontario MPP contact pages from ${ONT_SCRAPE_SOURCE}.`);
    return memberURLs;

  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not scrape Federal data. ${CONSOLE_RESET}`);
    throw error;
  }
}

/**
 * Function to scrape each Ontario MPP's contact page.
 * @param axiosInstance The axios instance to use for the request.
 * @returns The scrapeed Ontario MP page data as an Axios response object.
 */
export async function scrapeOntarioMPPDataFromURLs(axiosInstance: AxiosInstance, memberURLs: string[]): Promise<any> {
  console.log(`Scraping individial Ontario MPP contact pages...`)
  try {
    return await scrapeContactInfoInBatches(ONT_BASE_URL, memberURLs, axiosInstance);
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not scrape Federal data. ${CONSOLE_RESET}`);
    throw error;
  }
}
