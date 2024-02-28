import { OfficeInfo } from './interfaces';
import { REST_API_URL } from "@/config/constants";

/**
 * Interface for data from the _offices tables in snake case.
 */
interface OfficeInfoResponse {
  member_id: number;
  office_id: number;
  time_retrieved: number;
  office_type: string;
  office_title: string;
  office_address: string;
  office_city: string;
  office_province_perritory: string;
  office_postal_code: string;
  office_note: string;
  office_telephone: string;
  office_fax: string;
  office_email: string;
  office_toll_free: string;
  office_tty: string;
  source_url: string;
}

export async function getOfficeInfo(path: string): Promise<OfficeInfo[]> {
  const url = `${REST_API_URL}/${path}`;

  try {
    const repArray: OfficeInfo[] = [];
    const res = await fetch(url);
    const json = await res.json();

    // For each row, adapt to the columns interface
    json.forEach((row: OfficeInfoResponse) => {
      const thisOffice: OfficeInfo = {
        memberId: row.member_id,
        officeId: row.office_id,
        timeRetrieved: row.time_retrieved,
        officeType: row.office_type,
        officeTitle: row.office_title,
        officeAddress: row.office_address,
        officeCity: row.office_city,
        officeProvinceTerritory: row.office_province_perritory,
        officePostalCode: row.office_postal_code,
        officeNote: row.office_note,
        officeTelephone: row.office_telephone,
        officeFax: row.office_fax,
        officeEmail: row.office_email,
        officeTollFree: row.office_toll_free,
        officeTty: row.office_tty,
        sourceUrl: row.source_url,
      }
      repArray.push(thisOffice);
    });

    return repArray;
  } catch (error) {
    console.error(`Could not GET from ${REST_API_URL}/${path}`);
    throw error; 
  }
}
