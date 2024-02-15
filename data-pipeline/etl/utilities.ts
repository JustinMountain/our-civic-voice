import { parse } from 'csv-parse';
import fs from 'fs-extra';
import * as path from 'path';

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../config/constants';

export const FED_MEMBER_INFO_DIRECTORY = './csv/federal/member-info/';
export const FED_MEMBER_OFFICE_DIRECTORY = './csv/federal/office-info/';

/**
 * Converts a CSV file into a 2D array of strings for further processing.
 * @param filePath The location of the CSV file to be processed.
 * @returns 2D array of strings representing the CSV file.
 */
export async function processCSVtoMemory(directory: string): Promise<string[][]> {
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

/**
 * Finds the most recent CSV file in the provided directory.
 * @param directory The directory to check for CSV files.
 * @returns A string array of CSV file names in the provided directory.
 */
async function findMostRecentCSVFile(directory: string): Promise<string> {
  if (!await fs.pathExists(directory)) {
    throw new Error('Directory does not exist');
  }

  console.log(`Retrieving data from ${directory}...`);
  try {
    const files = await fs.readdir(directory);
    const allFileNames = files.filter(file => path.extname(file).toLowerCase() === '.csv');
    return allFileNames[0];
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Could not find CSV file. ${CONSOLE_RESET}`);
    throw error;
  }
}
