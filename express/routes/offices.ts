import express, { Request, Response } from 'express';
import pool from '../config/databasePool';

const router = express.Router();

// SELECT honorific, first_name, last_name, constituency, party, province_territory, 'Federal' AS gov_level FROM federal_mps WHERE LOWER(constituency) = '${constituency}';

router.get('/federal/:constituency', async (req: Request, res: Response) => {
  const constituency = req.params.constituency.toLowerCase();
  const officeStatement = `
    SELECT * 
    FROM federal_mp_offices
    WHERE LOWER(constituency) = '${constituency}';
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

router.get('/ontario/:constituency', async (req: Request, res: Response) => {
  const constituency = req.params.constituency.toLowerCase();
  const officeStatement = `
    SELECT * 
    FROM ontario_mpp_offices
    WHERE LOWER(constituency) = '${constituency}';
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
