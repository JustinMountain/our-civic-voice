import axios from 'axios';
import { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { writeFile } from 'fs/promises';

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../config/constants';
import { formatDateForFileName } from '../../config/csvUtilities';
import { checkForCSVUpdate } from '../../config/csvUtilities';

const ontarioMPPContactInfoURL = 'https://www.ola.org/sites/default/files/node-files/office_csvs/offices-all.csv';
const ontarioCSVFilepath = './ontario/csv-sources/csv-download/';

const timeRetrieved = Date.now();
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'document/xml',
    'Accept': 'document/xml'
  }
});

// Setup axios retry for status code 5xx and Network errors
axiosRetry(axiosInstance, {
  retries: 5,
  retryDelay: (retryCount) => { return retryCount * 1000},
  onRetry: (count, error, req) => { console.error(`${CONSOLE_ERROR}Retry attempt #${count}${CONSOLE_RESET} got ${error}`); },
  retryCondition: axiosRetry.isNetworkOrIdempotentRequestError, 
})  

/**
 * Runs the Ontario MPP scraper and creates a CSV file with the scraped data.
 * @returns True if the CSV file was created, false otherwise.
 */
export async function runOntarioMPPScraperToCSV(): Promise<Boolean> {
  console.log(`Starting the Ontario MPP scraper...`)
  try {
    const isFileCreated = await fetchOntarioMPPCSV(axiosInstance);

    if (isFileCreated) {
      const handled = await checkForCSVUpdate(ontarioCSVFilepath);
      console.log(`${CONSOLE_HIGHLIGHT}Ontario MPP scraper has completed!${CONSOLE_RESET}`);
      return handled;
    }
    return false;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Something went wrong running the Ontario MPP scraper. ${CONSOLE_RESET}`);
    throw error;
  }
}

/**
 * Helper function to fetch the Ontario MPP data from the source.
 * @param axiosInstance The axios instance to use for the request.
 * @returns True if the file was downloaded successfully, false otherwise.
 */
async function fetchOntarioMPPCSV(axiosInstance: AxiosInstance): Promise<Boolean> {
  console.log(`Fetching Ontario MPP data from ${ontarioMPPContactInfoURL}...`);
  const fileName = `${formatDateForFileName(timeRetrieved)}-ontario-mpps.csv`;

  try {
    const response = await axiosInstance.get(ontarioMPPContactInfoURL, {
      responseType: 'arraybuffer'
    });
  
    if (response.status === 200) {
      await writeFile(`${ontarioCSVFilepath}${fileName}`, response.data);
      console.log(`${CONSOLE_HIGHLIGHT}CSV file downloaded${CONSOLE_RESET} and saved to ${ontarioCSVFilepath}!`);
    } else {
      console.error('Failed to download CSV file:', response.status);
    }
    return true;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not fetch data${CONSOLE_RESET} from ${ontarioMPPContactInfoURL}. `);
    throw error;
  }
}
