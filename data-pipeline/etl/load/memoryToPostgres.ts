import pool from '../databasePool';
import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from '../constants';
import { dbQuery } from '../utilities';

import { RepInfo, OfficeInfo } from '../tableInterfaces';

/**
 * Populates the federal_mps table from in-memory data.
 * @param level Government level being processed.
 * @param allRepInfo An array of standardized RepInfo objects.
 * @returns True if successful, otherwise false.
 */
export async function populateMemberTable(level: string, allRepInfo: RepInfo[]): Promise<Boolean> {
  console.log('Connecting to the database...');
  try {
    const client = await pool.connect();

    console.log(`Attempting to insert ${level} representative records...`);
    for (const rep of allRepInfo) {
      const federalRepQuery = createRepQuery(level, rep);
      await client.query(federalRepQuery);
    }
    console.log(`${CONSOLE_HIGHLIGHT}Successfully inserted all ${level} representative info!${CONSOLE_RESET}`);
    client.release();
    return true;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Received database error. ${CONSOLE_RESET}`);
    throw error;
  }
}

/**
 * Populates the federal_mps table from in-memory data.
 * @param level Government level being processed.
 * @param allOfficeInfo An array of standardized OfficeInfo objects.
 * @returns True if successful, otherwise false.
 */
export async function populateOfficeTable(level: string, allOfficeInfo: OfficeInfo[]): Promise<Boolean> {
  console.log('Connecting to the database...');
  try {
    const client = await pool.connect();

    console.log(`Attempting to insert ${level} office records...`);
    for (const office of allOfficeInfo) {
      const federalOfficeQuery = createOfficeQuery(level, office);
      await client.query(federalOfficeQuery);
    }
    console.log(`${CONSOLE_HIGHLIGHT}Successfully inserted all ${level} office info!${CONSOLE_RESET}`);
    client.release();
    return true;
  } catch (error) {
    console.error(`${CONSOLE_ERROR}Received database error. ${CONSOLE_RESET}`);
    throw error;
  }
}

/**
 * Creates a database query for inserting a single record into the federal_mps table.
 * @param level Government level being processed.
 * @param rep A single record representing one Federal MP.
 * @returns A dbQuery object to use with a client connection.
 */
function createRepQuery(level: string, rep: RepInfo): dbQuery {
  const repQuery = {
    text: `INSERT INTO ${level}_reps (
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
  return repQuery;
}

/**
 * Creates a database query for inserting a single record into the federal_mps table.
 * @param level Government level being processed.
 * @param rep A single record representing one Federal MP.
 * @returns A dbQuery object to use with a client connection.
 */
function createOfficeQuery(level: string, office: OfficeInfo): dbQuery {
  const officeQuery = {
    text: `INSERT INTO ${level}_offices (
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
  return officeQuery;
}
