import axios from 'axios';
import { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { writeFile } from 'fs/promises';

import { formatDateForFileName } from '../csvUtilities';
import { checkForCSVUpdate } from '../csvUtilities';

const ontarioMPPContactInfoURL = 'https://www.ola.org/sites/default/files/node-files/office_csvs/offices-all.csv';
const ontarioCSVFilepath = './database/csv-sources/ontario/csv-download/';

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
  onRetry: (count, err, req) => { console.log(`retry attempt #${count} got ${err}`); },
  retryCondition: axiosRetry.isNetworkOrIdempotentRequestError, 
})  

async function fetchOntarioMPPCSV(axiosInstance: AxiosInstance): Promise<Boolean> {
  console.log('Fetching Ontario MPP data...');
  const fileName = `${formatDateForFileName(timeRetrieved)}-ontario-mpps.csv`;

  try {
    const response = await axios.get(ontarioMPPContactInfoURL, {
      responseType: 'arraybuffer'
    });
  
    if (response.status === 200) {
      await writeFile(`${ontarioCSVFilepath}${fileName}`, response.data);
      console.log(`CSV file downloaded and saved to ${ontarioCSVFilepath}`);
    } else {
      console.error('Failed to download CSV file:', response.status);
    }
    return true;
  } catch (error) {
    console.error(`Could not fetch data from ${ontarioMPPContactInfoURL}`);
    throw error;
  }
}

export async function runOntarioMPPScraperToCSV(): Promise<Boolean> {
  try {
    const ontarioMPPCSV = await fetchOntarioMPPCSV(axiosInstance);
    await checkForCSVUpdate(ontarioMPPCSV, ontarioCSVFilepath);
    return true;
  } catch (error) {
    console.error(`error`);
    throw error;
  }
}
