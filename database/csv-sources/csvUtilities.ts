import { format } from "date-fns";
import fs from 'fs-extra'
import { parse } from 'csv-parse';
import * as path from 'path';

export const consoleHighlight = "\x1b[34m";
export const consoleError = "\x1b[31m";
export const consoleReset = "\x1b[0m";

export function formatDateForFileName(timeRetrieved: number): string {
  const formattedDate = format(new Date(timeRetrieved), "yyyy-MM-dd-HH-mm");
  return formattedDate
}

export async function checkForCSVUpdate(created: Boolean, directory: string): Promise<Boolean> {
  // When a CSV File was successfully created:
  if (created) {
    console.log(`Handling CSV file created in ${directory}...`)
    const allFiles = await findCSVFiles(directory);

    // Make assumptions about requiring update based on number of files
    if (allFiles.length == 0) { return false; }
    if (allFiles.length == 1) { 
      console.log('Finished handling CSV file.\n')
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
        console.log(`${consoleHighlight}No changes detected, deleted new file.${consoleReset}\n`)
        return false;
      }
      if (!isIdentical) {
        // Situation 2: The files are different
        await fs.move(`${directory}/${oldFile}`, `${directory}/archive/${oldFile}`);
        console.log(`${consoleHighlight}Moved outdated file to archive.${consoleReset}\n`)
        return true;
      }
    } else {
      // Case for when the new file is different (determined by length)
      await fs.move(`${directory}/${oldFile}`, `${directory}/archive/${oldFile}`);
      console.log(`${consoleHighlight}Moved outdated file to archive.${consoleReset}\n`)
      return true;
    }
    return false;
  }

  // When no CSV was created
  if (!created) {
    console.log(`No file created in ${directory}, nothing to handle.`)
  }
  return false;
}

async function checkCSVEquality(directory: string, oldFileName: string, newFileName: string): Promise<Boolean> {
  try {
    // Read files
    const oldFileContent = await fs.promises.readFile(`${directory}/${oldFileName}`, { encoding: 'utf-8' });
    const newFileContent = await fs.promises.readFile(`${directory}/${newFileName}`, { encoding: 'utf-8' });

    // Parse CSV content
    const oldFileParsed = parse(oldFileContent);
    const newFileParsed = parse(newFileContent);

    // Compare the files
    return JSON.stringify(oldFileParsed) === JSON.stringify(newFileParsed);
  } catch (error) {
      console.error(error);
      return false;
  }
}

export async function findCSVFiles(directory: string): Promise<string[]> {
  if (!await fs.pathExists(directory)) {
    throw new Error('Directory does not exist');
  }

  // Read the directory and filter out CSV files
  const files = await fs.readdir(directory);
  return files.filter(file => path.extname(file).toLowerCase() === '.csv');
}

async function checkCSVLength(directory: string, fileName: string): Promise<number> {
  const filePath = `${directory}/${fileName}`;

  // Check if the file exists
  if (!await fs.pathExists(filePath)) {
      throw new Error('File does not exist');
  }

  let rowCount = 0;
  try {
    const parser = await fs.createReadStream(filePath).pipe(parse())

    for await (const record of parser) {
      rowCount++;
    }
    return rowCount;
  } catch (error) {
    console.error(error);
    throw(error);
  }
}
