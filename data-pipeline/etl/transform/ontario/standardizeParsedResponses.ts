import { ONT_CSV_SOURCE } from '../../config/constants';

import { RepInfo, OfficeInfo } from '../../config/tableInterfaces';
import { OntarioMemberCSVData, OntarioMemberPageData } from './parseResponses';


/**
 * Creates a standardized in-memory array used to populate the table for the Ontario MPP data.
 * @param pageData Parsed data from the Ontario MPP pages.
 * @param csvData Parsed data from the Ontario MPP CSV.
 * @returns Standardized RepInfo objects to use for DB insertion and CSV backup.
 */
export function standardizeOntarioMPPInfo(pageData: OntarioMemberPageData[], csvData: OntarioMemberCSVData[]): RepInfo[] {
  const repInfo: RepInfo[] = [];
  const timeRetrieved = Date.now();

  pageData.forEach((page) => {
    // Check if the constituency already exists in repInfo array
    const existingConstituency = repInfo.find(info => info.constituency === page.constituency);

    // If it doesn't exist, create it
    if (!existingConstituency) {

      // Look for matching constituency in the XML data for remaining info
      const repInfoMatch = csvData.find(info => info.constituency === page.constituency);
      if (repInfoMatch) {
        const thisRep: RepInfo = {
          memberId: repInfoMatch.memberId,
          timeRetrieved: timeRetrieved,
          honorific: repInfoMatch.honorific,
          firstName: repInfoMatch.firstName,
          lastName: repInfoMatch.lastName,
          constituency: page.constituency,
          provinceTerritory: repInfoMatch.provinceTerritory,
          party: repInfoMatch.partyAffiliation,
          email: repInfoMatch.generalEmail,
          website: '',
          imageUrl: page.image,
          sourceUrl: page.source,
        };
        repInfo.push(thisRep);
      }
    }
  });
  return repInfo;
}

/**
 * Creates a standardized in-memory array used to create the table for the Ontario MPP offices.
 * @param pageData Parsed data from the Ontario MPP pages.
 * @param csvData Parsed data from the Ontario MPP CSV.
 * @returns Standardized OfficeInfo objects to use for DB insertion and CSV backup.
 */
export function standardizeOntarioMPPOfficeInfo(pageData: OntarioMemberPageData[], csvData: OntarioMemberCSVData[]): OfficeInfo[] {
  const officeInfo: OfficeInfo[] = [];
  const timeRetrieved = Date.now();

  const arrayHeaders = csvData.shift();


  csvData.forEach((office) => {
    const thisOffice: OfficeInfo = {
      memberId: office.memberId,
      timeRetrieved: timeRetrieved,
      officeType: office.officeType,
      officeTitle: '',
      officeAddress: office.officeAddress,
      officeCity: office.officeCity,
      officeProvinceTerritory: 'Ontario',
      officePostalCode: office.postalCode,
      officeNote: '',
      officeTelephone: office.phone,
      officeFax: office.fax,
      officeEmail: office.officeEmail,
      officeTollFree: office.tollFree,
      officeTty: office.tty,
      sourceUrl: ONT_CSV_SOURCE,
    };
    officeInfo.push(thisOffice);
  });

  return officeInfo;
}
