import { REST_API_URL } from "@/config/constants";

export type RepInfo = {
  member_id: number,
  honorific: string,
  first_name: string,
  last_name: string,
  constituency: string,
  party: string,
  province_territory: string,
  gov_level: string,
}

export async function getDataForRepInfo(path: string): Promise<RepInfo[]> {
  const url = `${REST_API_URL}/${path}`;

  try {
    const officeArray: RepInfo[] = [];
    const res = await fetch(url);
    const json = await res.json();

    // For each row, adapt to the columns interface
    json.forEach((row: RepInfo) => {
      const thisOffice: RepInfo = {
        member_id: row.member_id,
        honorific: row.honorific,
        first_name: row.first_name,
        last_name: row.last_name,
        constituency: row.constituency,
        party: row.party,
        province_territory: row.province_territory,
        gov_level: row.gov_level,
      }
      officeArray.push(thisOffice);
    });

    return officeArray;
  } catch (error) {
    console.error(`Could not GET from ${REST_API_URL}/${path}`);
    throw error; 
  }
}

