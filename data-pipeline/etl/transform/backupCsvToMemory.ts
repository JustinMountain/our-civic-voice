import { parse } from 'csv-parse';
import fs from 'fs-extra';

import { RepInfo, OfficeInfo } from '../config/tableInterfaces';
import { findMostRecentCSVFile } from '../config/utilities';

/**
 * Creates a standardized in-memory array used to populate the table for the Federal MP data.
 * @returns Standardized RepInfo objects to use for DB insertion.
 */
export async function mostRecentCSVtoMemory(directory: string): Promise<RepInfo[]> {
  const recentMemberCSV = await processRecentCSVtoMemory(directory);
  const repInfo: RepInfo[] = [];

  recentMemberCSV.forEach((line) => {
    const thisRep: RepInfo = {
      memberId: parseInt(line[0]),
      timeRetrieved: parseInt(line[1]),
      honorific: line[2],
      firstName: line[3],
      lastName: line[4],
      constituency: line[5],
      provinceTerritory: line[6],
      party: line[7],
      email: line[8],
      website: line[9],
      govLevel: line[10],
      imageUrl: line[11],
      sourceUrl: line[12],
    };
    repInfo.push(thisRep);
  });
  return repInfo;
}

/**
 * Creates a standardized in-memory array used to populate the table for the Federal MP data.
 * @returns Standardized RepInfo objects to use for DB insertion.
 */
export async function mostRecentOfficeCSVtoMemory(directory: string): Promise<OfficeInfo[]> {
  const recentOfficeCSV = await processRecentCSVtoMemory(directory);
  const officeInfo: OfficeInfo[] = [];

  recentOfficeCSV.forEach((line) => {
    const thisOffice: OfficeInfo = {
      memberId: parseInt(line[0]),
      timeRetrieved: parseInt(line[1]),
      officeType: line[2],
      officeTitle: line[3],
      officeAddress: line[4],
      officeCity: line[5],
      officeProvinceTerritory: line[6],
      officePostalCode: line[7],
      officeNote: line[8],
      officeTelephone: line[9],
      officeFax: line[10],
      officeEmail: line[11],
      officeTollFree: line[12],
      officeTty: line[13],
      sourceUrl: line[14],
    };
    officeInfo.push(thisOffice);
  });
  return officeInfo;
}

/**
 * Converts a CSV file into a 2D array of strings for further processing.
 * @param filePath The location of the CSV file to be processed.
 * @returns 2D array of strings representing the CSV file.
 */
async function processRecentCSVtoMemory(directory: string): Promise<string[][]> {
  const records: string[][] = [];
  const mostRecentCSV = await findMostRecentCSVFile(directory);
  const filePath = `${directory}${mostRecentCSV}`;

  try {
    const parser = fs.createReadStream(filePath)
    .pipe(parse({ delimiter: ",", from_line: 1, relax_column_count: true }));

    for await (const record of parser) {
      records.push(record);
    }
    const arrayHeaders = records.shift();

    return records;

  } catch (error) {
    console.error(`Could not process CSV file: ${filePath}`);
    throw error;
  }
}
