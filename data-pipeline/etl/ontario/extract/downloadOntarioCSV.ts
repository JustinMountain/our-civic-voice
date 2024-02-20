import axios from 'axios';
import { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { writeFile } from 'fs/promises';

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../utilities';
import { ONT_MEMBER_INFO_DIRECTORY } from '../../utilities';

import { formatDateForFileName } from '../../utilities';

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
 * Helper function to fetch the Ontario MPP data from the source.
 * @param axiosInstance The axios instance to use for the request.
 * @returns True if the file was downloaded successfully, false otherwise.
 */
async function fetchOntarioMPPCSV(axiosInstance: AxiosInstance, ontarioMPPContactInfoURL: string): Promise<Boolean> {
  console.log(`Fetching Ontario MPP data from ${ontarioMPPContactInfoURL}...`);
  const fileName = `${formatDateForFileName(timeRetrieved)}-ontario-mpps.csv`;

  try {
    const response = await axiosInstance.get(ontarioMPPContactInfoURL, {
      responseType: 'arraybuffer'
    });
  
    if (response.status === 200) {
      await writeFile(`${ONT_MEMBER_INFO_DIRECTORY}${fileName}`, response.data);
      console.log(`${CONSOLE_HIGHLIGHT}CSV file downloaded${CONSOLE_RESET} and saved to ${ONT_MEMBER_INFO_DIRECTORY}!`);
    } else {
      console.error('Failed to download CSV file:', response.status);
    }
    return true;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not fetch data${CONSOLE_RESET} from ${ontarioMPPContactInfoURL}. `);
    throw error;
  }
}
