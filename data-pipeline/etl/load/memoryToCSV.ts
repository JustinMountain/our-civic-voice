import { createObjectCsvWriter } from 'csv-writer';

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../config/constants';
import { formatDateForFileName } from '../config/utilities';

import { RepInfo, OfficeInfo } from '../config/tableInterfaces';

/**
 * Function to create a CSV file from the standardized Representative data.
 * @param level Government level being processed.
 * @param filePath Directory filepath to store the created CSV.
 * @param data An array of standardized RepInfo objects.
 * @returns True if the CSV file was created, false otherwise.
 */
export async function createMembersCSV(level: string, filePath: string, data: RepInfo[]): Promise<Boolean> {
  const fileName = `${formatDateForFileName(data[0].timeRetrieved)}-${level}-members.csv`;
  const csvFilepath = `${filePath}${fileName}`;

  console.log(`Writing ${level} representative data to CSV...`);
  try {
    // Create CSV from scraped data
    const csvWriter = createObjectCsvWriter({
      path: csvFilepath,
      header: [
        { id: 'memberId', title: 'member_id' },
        { id: 'timeRetrieved', title: 'time_retrieved' },        
        { id: 'honorific', title: 'honorific' },
        { id: 'firstName', title: 'first_name' },
        { id: 'lastName', title: 'last_name' },
        { id: 'constituency', title: 'constituency' },
        { id: 'provinceTerritory', title: 'province_territory' },
        { id: 'party', title: 'party' },
        { id: 'email', title: 'email' },
        { id: 'website', title: 'website' },
        { id: 'govLevel', title: 'gov_level' },
        { id: 'imageUrl', title: 'image_url' },
        { id: 'sourceUrl', title: 'source_url'}
      ]
    });

    // Write CSV and notify user
    await csvWriter.writeRecords(data);
    console.log(
      `${CONSOLE_HIGHLIGHT}Processed all ${data.length} representatives${CONSOLE_RESET} to ${fileName}!`
    );    
    return true;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not write data${CONSOLE_RESET} to ${csvFilepath}. `);
    throw error;
  }
}

/**
 * Function to create a CSV file from the standardized Office data.
 * @param level Government level being processed.
 * @param filePath Directory filepath to store the created CSV.
 * @param data An array of standardized OfficeInfo objects.
 * @returns True if the CSV file was created, false otherwise.
 */
export async function createMemberOfficeCSV(level: string, filePath: string, data: OfficeInfo[]): Promise<Boolean> {
  const fileName = `${formatDateForFileName(data[0].timeRetrieved)}-${level}-offices.csv`;
  const csvFilepath = `${filePath}${fileName}`;

  console.log(`Writing ${level} office info to CSV...`);
  try {
    // Create CSV from scraped data
    const csvWriter = createObjectCsvWriter({
      path: csvFilepath,
      header: [
        { id: 'memberId', title: 'member_id' },
        { id: 'timeRetrieved', title: 'time_retrieved' },        
        { id: 'officeType', title: 'office_type' },
        { id: 'officeTitle', title: 'office_title' },
        { id: 'officeAddress', title: 'office_address' },
        { id: 'officeCity', title: 'office_city' },
        { id: 'officeProvinceTerritory', title: 'office_province_territory' },
        { id: 'officePostalCode', title: 'office_postal_code' },
        { id: 'officeNote', title: 'office_note' },
        { id: 'officeTelephone', title: 'office_phone' },
        { id: 'officeFax', title: 'office_fax' },
        { id: 'officeEmail', title: 'office_email'},
        { id: 'officeTollFree', title: 'office_toll_free'},
        { id: 'officeTty', title: 'office_tty'},
        { id: 'sourceUrl', title: 'source_url'}
      ]
    });

    // Write CSV and notify user
    await csvWriter.writeRecords(data);
    console.log(
      `${CONSOLE_HIGHLIGHT}Processed all ${data.length} MP Offices ${CONSOLE_RESET} to ${fileName}!`
    );    
    return true;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not write data${CONSOLE_RESET} to ${csvFilepath}. `);
    throw error;
  }
}
