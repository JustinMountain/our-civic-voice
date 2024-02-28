import { RepInfo } from './interfaces';
import { REST_API_URL } from "@/config/constants";

/**
 * Interface for data from the _reps tables in snake case.
 */
interface RepInfoResponse {
  member_id: number;
  time_retrieved: number;
  honorific: string;
  first_name: string;
  last_name: string;
  constituency: string | undefined;
  province_territory: string;
  party: string;
  email: string;
  website: string;
  gov_level: string;
  image_url: string | undefined;
  source_url: string;
}

export async function getRepInfo(path: string): Promise<RepInfo[]> {
  const url = `${REST_API_URL}/${path}`;

  try {
    const repArray: RepInfo[] = [];
    const res = await fetch(url);
    const json = await res.json();

    // For each row, adapt to the columns interface
    json.forEach((row: RepInfoResponse) => {
      const thisRep: RepInfo = {
        memberId: row.member_id,
        timeRetrieved: row.time_retrieved,
        honorific: row.honorific,
        firstName: row.first_name,
        lastName: row.last_name,
        constituency: row.constituency,
        provinceTerritory: row.province_territory,
        party: row.party,
        email: row.email,
        website: row.website,
        govLevel: row.gov_level,
        imageUrl: row.image_url,
        sourceUrl: row.source_url,
      }
      repArray.push(thisRep);
    });

    return repArray;
  } catch (error) {
    console.error(`Could not GET from ${REST_API_URL}/${path}`);
    throw error; 
  }
}
