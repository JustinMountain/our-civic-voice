import { AxiosInstance } from 'axios';
import { writeFile } from 'fs/promises';

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../constants';

import { formatDateForFileName } from '../../utilities';

/**
 * Function to fetch the Ontario MPP data from the source.
 * @param axiosInstance The axios instance to use for the request.
 * @returns True if the file was downloaded successfully, false otherwise.
 */
export async function downloadOntarioMPPCSV(axiosInstance: AxiosInstance, sourceLocation: string, destDirectory: string): Promise<Boolean> {
  console.log(`Fetching Ontario MPP data from ${sourceLocation}...`);
  
  const timeRetrieved = Date.now();
  const fileName = `${formatDateForFileName(timeRetrieved)}-ontario-mpps.csv`;

  try {
    const response = await axiosInstance.get(sourceLocation, {
      responseType: 'arraybuffer'
    });
  
    if (response.status === 200) {
      await writeFile(`${destDirectory}${fileName}`, response.data);
      console.log(`${CONSOLE_HIGHLIGHT}CSV file downloaded${CONSOLE_RESET} and saved to ${destDirectory}!`);
    } else {
      console.error('Failed to download CSV file:', response.status);
    }
    return true;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not fetch data${CONSOLE_RESET} from ${sourceLocation}. `);
    throw error;
  }
}
