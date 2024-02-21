import fs from 'fs';
import { parse } from 'csv-parse';

import { findMostRecentCSVFile } from '../../utilities';

// Next up create a scraper for source url and image
// Parse that info, create the merge function like Federal

/**
 * Represents data about a Ontario member retrieved from downloaded CSV.
 * @interface
 */
export interface OntarioMemberCSVData {
  honorific: string;
  firstName: string;
  lastName: string;
  officeType: string;
  officeAddress: string;
  officeCity: string;
  provinceTerritory: string;
  postalCode: string;
  officeEmail: string;
  generalEmail: string;
  phone: string;
  fax: string;
  tollFree: string;
  tty: string;
  constituency: string;
  partyAffiliation: string;
  parliamentaryRole: string;
  memberId: number;
}

export async function parseOntarioCSV(directory: string): Promise<OntarioMemberCSVData[]> {
  const latestCSV = await findMostRecentCSVFile(directory);
  const records: OntarioMemberCSVData[] = [];

  try {
    const parser = fs.createReadStream(`${directory}${latestCSV}`)
    .pipe(parse({ delimiter: ",", from_line: 1, relax_column_count: true }));

    for await (const oneMember of parser) {
      const thisMember: OntarioMemberCSVData = {
        honorific: oneMember[0],
        firstName: oneMember[1],
        lastName: oneMember[2],
        officeType: oneMember[3],
        officeAddress: oneMember[4],
        officeCity: oneMember[5],
        provinceTerritory: oneMember[6],
        postalCode: oneMember[7],
        officeEmail: oneMember[8],
        generalEmail: oneMember[9],
        phone: oneMember[10],
        fax: oneMember[11],
        tollFree: oneMember[12],
        tty: oneMember[13],
        constituency: oneMember[14],
        partyAffiliation: oneMember[15],
        parliamentaryRole: oneMember[16],
        memberId: parseInt(oneMember[17], 10)
      }
      records.push(thisMember);
    }
    return records;

  } catch (error) {
    console.error(`Could not process CSV file: ${latestCSV}`);
    throw error;
  }
}
