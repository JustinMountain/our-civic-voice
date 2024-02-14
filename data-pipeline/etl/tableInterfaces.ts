/**
 * Interface for the rep_info tables.
 */
export interface repInfo {
  member_id: number;
  time_retrieved: number;
  honorific: string;
  first_name: string;
  last_name: string;
  constituency: string;
  province_territory: string;
  party: string;
  email: string;
  website: string;
  image_url: string;
  source_url: string;
}

/**
 * Interface for the office_info tables.
 */
export interface officeInfo {
  member_id: number;
  time_retrieved: number;
  office_id: string;
  office_type: string;
  office_title: string;
  office_address: string;
  office_city: string;
  office_province: string;
  office_postal_code: string;
  office_note: string;
  office_telephone: string;
  office_fax: string;
  office_email: string;
  office_toll_free: string;
  office_tty: string;
  image_url: string;
  source_url: string;
}

