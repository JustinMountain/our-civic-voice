import express, { Request, Response } from 'express';
import pool from '../config/databasePool';

const router = express.Router();
const officeSelect = `
  SELECT member_id,
    office_id,
    constituency,
    general_email,
    office_type,
    office_address,
    office_city,
    office_province,
    office_postal_code,
    office_telephone,
    office_fax,
    updated_date
`;

router.get('/federal/:member_id', async (req: Request, res: Response) => {
  const member_id = req.params.member_id;
  const officeStatement = `
    ${officeSelect}
    FROM federal_mp_offices
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

router.get('/ontario/:member_id', async (req: Request, res: Response) => {
  const member_id = req.params.member_id.toLowerCase();
  const officeStatement = `
    ${officeSelect}
    FROM ontario_mpp_offices
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
