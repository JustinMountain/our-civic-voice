import express, { Request, Response } from 'express';
import pool from '../config/databasePool';

const router = express.Router();
const officeSelect = `
  SELECT member_id,
    office_id,
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
    source_url
  `;

/**
 * Handle GET request to retrieve a specific Federal Member's office info from the database.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<boolean>} - A promise that resolves to true if successful.
 */
router.get('/federal/:member_id', async (req: Request, res: Response): Promise<Boolean> => {
  const member_id = req.params.member_id;
  const officeStatement = `
    ${officeSelect}
    FROM federal_offices
    WHERE member_id = '${member_id}';
  `;

  try {
    const client = await pool.connect();
    const reps = await client.query(officeStatement);

    res.status(200).json(reps.rows); 
    client.release();
    return true;
  } catch (error) {
    res.status(500).json({ message: 'Error connecting to database.' });
    console.error(`Could not GET from Federal table.`);
    throw error; 
  }
});

/**
 * Handle GET request to retrieve a specific Ontario Member's office info from the database.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<boolean>} - A promise that resolves to true if successful.
 */
router.get('/ontario/:member_id', async (req: Request, res: Response): Promise<Boolean> => {
  const member_id = req.params.member_id.toLowerCase();
  const officeStatement = `
    ${officeSelect}
    FROM ontario_offices
    WHERE member_id = '${member_id}';
  `;

  try {
    const client = await pool.connect();
    const reps = await client.query(officeStatement);

    res.status(200).json(reps.rows); 
    client.release();
    return true;
  } catch (error) {
    res.status(500).json({ message: 'Error connecting to database.' });
    console.error(`Could not GET from Federal table.`);
    throw error; 
  }
});

module.exports = router;
