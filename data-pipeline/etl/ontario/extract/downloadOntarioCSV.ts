import { AxiosInstance } from 'axios';
import { writeFile } from 'fs/promises';

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../constants';
import { ONT_MEMBER_INFO_DIRECTORY, ONT_CSV_SOURCE } from '../../constants';

import { formatDateForFileName } from '../../utilities';

/**
 * Function to fetch the Ontario MPP data from the source.
 * @param axiosInstance The axios instance to use for the request.
 * @returns True if the file was downloaded successfully, false otherwise.
 */
export async function downloadOntarioMPPCSV(axiosInstance: AxiosInstance): Promise<Boolean> {
  console.log(`Fetching Ontario MPP data from ${ONT_CSV_SOURCE}...`);
  
  const timeRetrieved = Date.now();
  const fileName = `${formatDateForFileName(timeRetrieved)}-ontario-mpps.csv`;

  try {
    const response = await axiosInstance.get(ONT_CSV_SOURCE, {
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
    console.error(`${CONSOLE_ERROR}Could not fetch data${CONSOLE_RESET} from ${ONT_CSV_SOURCE}. `);
    throw error;
  }
}
