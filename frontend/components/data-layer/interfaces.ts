/**
 * Interface for data from the ____reps tables.
 */
export interface RepInfo {
  memberId: number;
  timeRetrieved: number;
  honorific: string;
  firstName: string;
  lastName: string;
  constituency: string | undefined;
  provinceTerritory: string;
  party: string;
  email: string;
  website: string;
  govLevel: string;
  imageUrl: string | undefined;
  sourceUrl: string;
}

/**
 * Interface for data from the ____offices tables.
 */
export interface OfficeInfo {
  memberId: number;
  officeId: number;
  timeRetrieved: number;
  officeType: string;
  officeTitle: string;
  officeAddress: string;
  officeCity: string;
  officeProvinceTerritory: string;
  officePostalCode: string;
  officeNote: string;
  officeTelephone: string;
  officeFax: string;
  officeEmail: string;
  officeTollFree: string;
  officeTty: string;
  sourceUrl: string;
}
