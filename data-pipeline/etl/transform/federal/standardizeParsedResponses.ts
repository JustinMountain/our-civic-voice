import { RepInfo, OfficeInfo } from '../../config/tableInterfaces';
import { FederalMemberXMLData, FederalMemberPageData } from "./parseResponses";

/**
 * Creates a standardized in-memory array used to populate the table for the Federal MP data.
 * @param pageData Parsed data from the Federal MP pages.
 * @param xmlData Parsed data from the Federal MP XML.
 * @returns Standardized RepInfo objects to use for DB insertion and CSV backup.
 */
export function standardizeFederalMPInfo(pageData: FederalMemberPageData[], xmlData: FederalMemberXMLData[]): RepInfo[] {
  const repInfo: RepInfo[] = [];
  const timeRetrieved = Date.now();

  pageData.forEach((page) => {
    // Check if the constituency already exists in repInfo array
    const existingConstituency = repInfo.find(info => info.constituency === page.constituency);

    // If it doesn't exist, create it
    if (!existingConstituency) {

      // Look for matching constituency in the XML data for remaining info
      const repInfoMatch = xmlData.find(info => info.constituency === page.constituency);
      if (repInfoMatch) {
        const thisRep: RepInfo = {
          memberId: page.member_id,
          timeRetrieved: timeRetrieved,
          honorific: repInfoMatch.honorific,
          firstName: repInfoMatch.firstName,
          lastName: repInfoMatch.lastName,
          constituency: page.constituency,
          provinceTerritory: repInfoMatch.provinceTerritory,
          party: repInfoMatch.partyAffiliation,
          email: page.email,
          website: page.website,
          govLevel: 'Federal',
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
 * Creates a standardized in-memory array used to create the table for the Federal MP offices.
 * @param pageData Parsed data from the Federal MP pages.
 * @returns Standardized OfficeInfo objects to use for DB insertion and CSV backup.
 */
export function standardizeFederalMPOfficeInfo(pageData: FederalMemberPageData[]): OfficeInfo[] {
  const officeInfo: OfficeInfo[] = [];
  const timeRetrieved = Date.now();

  pageData.forEach((page) => {
    const thisOffice: OfficeInfo = {
      memberId: page.member_id,
      timeRetrieved: timeRetrieved,
      officeType: page.officeType,
      officeTitle: page.officeTitle,
      officeAddress: page.officeAddress,
      officeCity: page.officeCity,
      officeProvinceTerritory: page.officeProvinceTerritory,
      officePostalCode: page.officePostalCode,
      officeNote: page.officeNote,
      officeTelephone: page.officePhone,
      officeFax: page.officeFax,
      officeEmail: '',
      officeTollFree: '',
      officeTty: '',
      sourceUrl: page.source,
    };
    officeInfo.push(thisOffice);
  });

  return officeInfo;
}
