import pool from '../../../config/databasePool';
import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../../constants';
import { dbQuery } from '../../../config/populationUtilities';

import { RepInfo } from '../../tableInterfaces';
import { OfficeInfo } from '../../tableInterfaces';

/**
 * Populates the federal_mps table from in-memory data.
 * @returns True if successful, otherwise false.
 */
export async function populateFederalMemberTable(allRepInfo: RepInfo[]): Promise<Boolean> {
  console.log('Connecting to the database...');
  try {
    const client = await pool.connect();

    console.log('Attempting to insert Federal Member records...');
    for (const rep of allRepInfo) {
      const federalRepQuery = createFederalRepQuery(rep);
      await client.query(federalRepQuery);
    }
    console.log(`${CONSOLE_HIGHLIGHT}Successfully inserted all Federal Member info!${CONSOLE_RESET}`);
    client.release();
    return true;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Received database error. ${CONSOLE_RESET}`);
    throw error;
  }
}

/**
 * Populates the federal_mps table from in-memory data.
 * @returns True if successful, otherwise false.
 */
export async function populateFederalOfficeTable(allOfficeInfo: OfficeInfo[]): Promise<Boolean> {
  console.log('Connecting to the database...');
  try {
    const client = await pool.connect();

    console.log('Attempting to insert Federal Office records...');
    for (const office of allOfficeInfo) {
      const federalOfficeQuery = createFederalOfficeQuery(office);
      await client.query(federalOfficeQuery);
    }
    console.log(`${CONSOLE_HIGHLIGHT}Successfully inserted all Federal Office info!${CONSOLE_RESET}`);
    client.release();
    return true;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Received database error. ${CONSOLE_RESET}`);
    throw error;
  }
}

/**
 * Creates a database query for inserting a single record into the federal_mps table.
 * @param rep A single record representing one Federal MP.
 * @returns A dbQuery object to use with a client connection.
 */
function createFederalRepQuery(rep: RepInfo): dbQuery {
  const mpQuery = {
    text: `INSERT INTO federal_mps_new (
      member_id,
      time_retrieved,
      honorific,
      first_name,
      last_name,
      constituency,
      province_territory,
      party,
      email,
      website,
      image_url,
      source_url) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`,
    values: [
      rep.memberId,
      new Date(rep.timeRetrieved),
      rep.honorific,
      rep.firstName,
      rep.lastName,
      rep.constituency,
      rep.provinceTerritory,
      rep.party,
      rep.email,
      rep.website,
      rep.imageUrl,
      rep.sourceUrl,
    ],
  };
  return mpQuery;
}

/**
 * Creates a database query for inserting a single record into the federal_mps table.
 * @param rep A single record representing one Federal MP.
 * @returns A dbQuery object to use with a client connection.
 */
function createFederalOfficeQuery(office: OfficeInfo): dbQuery {
  const mpOfficeQuery = {
    text: `INSERT INTO federal_mp_offices_new (
      member_id,
      time_retrieved,
      office_type,
      office_title,
      office_address,
      office_city,
      office_province,
      office_postal_code,
      office_note,
      office_telephone,
      office_fax,
      office_email,
      office_toll_free,
      office_tty,
      source_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);`,
    values: [
      office.memberId,
      new Date(office.timeRetrieved),
      office.officeType,
      office.officeTitle,
      office.officeAddress,
      office.officeCity,
      office.officeProvinceTerritory,
      office.officePostalCode,
      office.officeNote,
      office.officeTelephone,
      office.officeFax,
      office.officeEmail,
      office.officeTollFree,
      office.officeTty,
      office.sourceUrl,
    ],
  };
  return mpOfficeQuery;
}
