import { createObjectCsvWriter } from 'csv-writer';

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../../config/constants';
import { formatDateForFileName } from '../../utilities';

import { RepInfo } from '../../tableInterfaces';
import { OfficeInfo } from '../../tableInterfaces';

import { FED_MEMBER_INFO_DIRECTORY, FED_MEMBER_OFFICE_DIRECTORY } from '../../utilities';

/**
 * Function to create a CSV file from the standardized Federal Representative data.
 * @param data An array of standardized RepInfo objects.
 * @returns True if the CSV file was created, false otherwise.
 */
export async function createFederalMembersCSV(data: RepInfo[]): Promise<Boolean> {
  const fileName = `${formatDateForFileName(data[0].timeRetrieved)}-federal-mp.csv`;

  const CSV_FILEPATH = `${FED_MEMBER_INFO_DIRECTORY}${fileName}`;

  console.log('Writing Federal MP data to CSV...');
  try {
    // Create CSV from scraped data
    const csvWriter = createObjectCsvWriter({
      path: CSV_FILEPATH,
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
        { id: 'imageUrl', title: 'image_url' },
        { id: 'sourceUrl', title: 'source_url'}
      ]
    });

    // Write CSV and notify user
    await csvWriter.writeRecords(data);
    console.log(
      `${CONSOLE_HIGHLIGHT}Processed all ${data.length} MPs${CONSOLE_RESET} to ${fileName}!`
    );    
    return true;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not write data${CONSOLE_RESET} to ${CSV_FILEPATH}. `);
    throw error;
  }
}

/**
 * Function to create a CSV file from the standardized Federal Representative data.
 * @param data An array of standardized RepInfo objects.
 * @returns True if the CSV file was created, false otherwise.
 */
export async function createFederalMemberOfficeCSV(data: OfficeInfo[]): Promise<Boolean> {
  const fileName = `${formatDateForFileName(data[0].timeRetrieved)}-federal-mp-offices.csv`;

  const CSV_FILEPATH = `${FED_MEMBER_OFFICE_DIRECTORY}${fileName}`;

  console.log('Writing Federal MP contact info to CSV...');
  try {
    // Create CSV from scraped data
    const csvWriter = createObjectCsvWriter({
      path: CSV_FILEPATH,
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
    console.error(`${CONSOLE_ERROR}Could not write data${CONSOLE_RESET} to ${CSV_FILEPATH}. `);
    throw error;
  }
}
