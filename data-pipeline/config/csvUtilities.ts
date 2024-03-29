import { format } from "date-fns";
import fs from 'fs-extra'
import { parse } from 'csv-parse';
import * as path from 'path';

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from './constants';

/**
 * Formats a timestamp (from Date object) for use in a file name.
 * @param timeRetrieved Number received from Date.now().
 * @returns A string in the format yyyy-MM-dd-HH-mm.
 */
export function formatDateForFileName(timeRetrieved: number): string {
  const formattedDate = format(new Date(timeRetrieved), "yyyy-MM-dd-HH-mm");
  return formattedDate
}

/**
 * Checks if the CSV files in the provided directory require the database to update.
 * @param directory The directory to check for CSV files.
 * @returns True if there was a CSV update, otherwise false.
 */
export async function checkForCSVUpdate(directory: string): Promise<Boolean> {
  console.log(`Handling CSV file created in ${directory}...`)
  const allFiles = await findCSVFiles(directory);

  // Make assumptions about requiring update based on number of files
  if (allFiles.length == 0) { return false; }
  if (allFiles.length == 1) { 
    console.log(`${CONSOLE_HIGHLIGHT}Finished handling CSV file.${CONSOLE_RESET}`)
    return true; }

  // If there are two or more files, the most recent 2 will be checked
  const oldFile = allFiles[0];
  const newFile = allFiles[1];
  const oldLength = await checkCSVLength(directory, oldFile);
  const newLength = await checkCSVLength(directory, newFile);

  if (oldLength === newLength) {
    console.log("Files are the same length, checking for equality...");
    const isIdentical = await checkCSVEquality(directory, oldFile, newFile);

    if (isIdentical) {
      // Situation 1: The files are the same
      fs.remove(`${directory}/${newFile}`);
      console.log(`${CONSOLE_HIGHLIGHT}No changes detected, deleted new file.${CONSOLE_RESET}`)
      return false;
    }
    if (!isIdentical) {
      // Situation 2: The files are different
      await fs.move(`${directory}/${oldFile}`, `${directory}/archive/${oldFile}`);
      console.log(`${CONSOLE_HIGHLIGHT}Moved outdated file to archive.${CONSOLE_RESET}`)
      return true;
    }
  } else {
    // Case for when the new file is different (determined by length)
    await fs.move(`${directory}/${oldFile}`, `${directory}/archive/${oldFile}`);
    console.log(`${CONSOLE_HIGHLIGHT}Moved outdated file to archive.${CONSOLE_RESET}`)
    return true;
  }
  return false;
}

/**
 * Finds all of the CSV files in the provided directory.
 * @param directory The directory to check for CSV files.
 * @returns A string array of CSV file names in the provided directory.
 */
export async function findCSVFiles(directory: string): Promise<string[]> {
  if (!await fs.pathExists(directory)) {
    throw new Error('Directory does not exist');
  }

  // Read the directory and filter out CSV files
  const files = await fs.readdir(directory);
  return files.filter(file => path.extname(file).toLowerCase() === '.csv');
}

/**
 * Helper function that checks if two CSV files are equal.
 * @param directory The directory to check for CSV files.
 * @param oldFileName The older filename to be checked.
 * @param newFileName The newer filename to be checked.
 * @returns True if the files are equal, otherwise false.
 */
async function checkCSVEquality(directory: string, oldFileName: string, newFileName: string): Promise<Boolean> {
  console.log(`Checking CSV files for equality...`)
  try {
    // Read files
    const oldFileContent = await fs.promises.readFile(`${directory}/${oldFileName}`, { encoding: 'utf-8' });
    const newFileContent = await fs.promises.readFile(`${directory}/${newFileName}`, { encoding: 'utf-8' });

    // Parse CSV content
    const oldFileParsed = parse(oldFileContent, { relax_column_count: true });
    const newFileParsed = parse(newFileContent, { relax_column_count: true });

    // Compare the files
    return JSON.stringify(oldFileParsed) === JSON.stringify(newFileParsed);
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Something went wrong checking CSV files. ${CONSOLE_RESET}`);
    throw error; 
  }
}

/**
 * Helper function that checks the length of a CSV file.
 * @param directory The directory to find the CSV file.
 * @param fileName The filename to be checked.
 * @returns The number of rows in the CSV file.
 */
async function checkCSVLength(directory: string, fileName: string): Promise<number> {
  const filePath = `${directory}/${fileName}`;

  // Check if the file exists
  if (!await fs.pathExists(filePath)) {
      throw new Error('File does not exist');
  }

  let rowCount = 0;
  try {
    const parser = await fs.createReadStream(filePath)
    .pipe(parse({ delimiter: ",", from_line: 1, relax_column_count: true }));

    for await (const record of parser) {
      rowCount++;
    }
    return rowCount;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Something went wrong reading the CSV file. ${CONSOLE_RESET}`);
    throw error; 
  }
}
