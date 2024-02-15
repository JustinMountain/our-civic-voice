import { processCSVtoMemory } from '../../utilities';
import { FED_MEMBER_INFO_DIRECTORY } from '../../utilities';

import { RepInfo } from '../../tableInterfaces';

/**
 * Creates a standardized in-memory array used to populate the table for the Federal MP data.
 * @returns Standardized RepInfo objects to use for DB insertion.
 */
export async function standardizeFederalRepCSVResponse(): Promise<RepInfo[]> {
  const recentFedMemberCSV = await processCSVtoMemory(FED_MEMBER_INFO_DIRECTORY);
  const repInfo: RepInfo[] = [];

  recentFedMemberCSV.forEach((line) => {
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
      imageUrl: line[10],
      sourceUrl: line[11],
    };
    repInfo.push(thisRep);
  });
  return repInfo;
}
