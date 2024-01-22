import { parse } from 'csv-parse';
import fs from 'fs';

/**
 * Interface to use when creating a query to insert into the database.
 */
export interface dbQuery {
  text: string;
  values: (string | number | Date)[];
}

/**
 * Converts a CSV file into a 2D array of strings for further processing.
 * @param filePath The location of the CSV file to be processed.
 * @returns 2D array of strings representing the CSV file.
 */
export async function processCSVtoMemory(filePath: string): Promise<string[][]> {
  const records: string[][] = [];

  try {
    const parser = fs.createReadStream(filePath)
    .pipe(parse({ delimiter: ",", from_line: 1, relax_column_count: true }));

    for await (const record of parser) {
      records.push(record);
    }
    return records;

  } catch (error) {
    console.error(`Could not process CSV file: ${filePath}`);
    throw error;
  }
}
