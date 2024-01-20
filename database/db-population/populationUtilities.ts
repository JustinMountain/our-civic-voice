import { parse } from 'csv-parse';
import fs from 'fs';

export interface dbQuery {
  text: string;
  values: (string | number)[];
}

export async function processCSVtoMemory(filePath: string): Promise<string[][]> {
  const records: string[][] = [];

  const parser = fs.createReadStream(filePath)
    .pipe(parse({ delimiter: ",", from_line: 1, relax_column_count: true }));

  for await (const record of parser) {
    records.push(record);
  }
  return records;
}
