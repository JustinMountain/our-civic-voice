import { REST_API_URL } from "@/config/constants";

export type OfficeInfo = {
  office_id: string,
  constituency: string,
  general_email: string,
  office_type: string,
  office_address: string,
  office_city: string,
  office_province: string,
  office_postal_code: string,
  office_telephone: string,
  office_fax: string,
  updated_date: string,
}

export async function getDataForOfficeInfo(path: string): Promise<OfficeInfo[]> {
  const url = `${REST_API_URL}/${path}`;

  try {
    const officeArray: OfficeInfo[] = [];
    const res = await fetch(url);
    const json = await res.json();

    // For each row, adapt to the columns interface
    json.forEach((row: OfficeInfo) => {
      const thisOffice: OfficeInfo = {
        office_id: `${row.office_id}`,
        constituency: `${row.constituency}`,
        general_email: `${row.general_email}`,
        office_type: `${row.office_type}`,
        office_address: `${row.office_address}`,
        office_city: `${row.office_city}`,
        office_province: `${row.office_province}`,
        office_postal_code: `${row.office_postal_code}`,
        office_telephone: `${row.office_telephone}`,
        office_fax: `${row.office_fax}`,
        updated_date: `${row.updated_date}`,
      }
      officeArray.push(thisOffice);
    });

    return officeArray;
  } catch (error) {
    console.error(`Could not GET from ${REST_API_URL}/${path}`);
    throw error; 
  }
}

