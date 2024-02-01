import express, { Request, Response } from 'express';
import pool from '../config/databasePool';

const router = express.Router();
const repSelect = `
  SELECT member_id,
    honorific, 
    first_name, 
    last_name, 
    constituency, 
    party, 
`;
const allSelect = `
    province_territory, 
    gov_level 
`;
const federalSelect = `
    province_territory, 
    'Federal' AS gov_level 
`;
const ontarioSelect = `
    'Ontario' AS province_territory, 
    'Provincial' AS gov_level
`;

router.get('/', async (req: Request, res: Response) => {
  const repStatement = `
    ${repSelect}
    ${allSelect}
    FROM all_representatives;
  `;

  try {
    const client = await pool.connect();

    const reps = await client.query(repStatement);

    res.status(200).json(reps.rows); 
    client.release();
    return true;
  } catch (error) {
    res.status(500).json({ message: 'Error connecting to database.' });
    console.error(`Could not GET from All Representative view.`);
    throw error; 
  }
});

router.get('/federal', async (req: Request, res: Response) => {
  const repStatement = `
    ${repSelect}
    ${federalSelect}
    FROM federal_mps;
  `;

  try {
    const client = await pool.connect();

    const reps = await client.query(repStatement);

    res.status(200).json(reps.rows); 
    client.release();
    return true;
  } catch (error) {
    res.status(500).json({ message: 'Error connecting to database.' });
    console.error(`Could not GET from Federal table.`);
    throw error; 
  }
});

router.get('/federal/:member_id', async (req: Request, res: Response) => {
  const memberId = req.params.member_id.toLowerCase();
  const repStatement = `
    ${repSelect}
    ${federalSelect}
    FROM federal_mps WHERE member_id = '${memberId}';
  `;

  try {
    const client = await pool.connect();

    const reps = await client.query(repStatement);

    res.status(200).json(reps.rows); 
    client.release();
    return true;
  } catch (error) {
    res.status(500).json({ message: 'Error connecting to database.' });
    console.error(`Could not GET from Federal table.`);
    throw error; 
  }
});

router.get('/ontario', async (req: Request, res: Response) => {
  const repStatement = `
    ${repSelect}
    ${ontarioSelect}
    FROM ontario_mpps;
  `;

  try {
    const client = await pool.connect();

    const reps = await client.query(repStatement);

    // const reps = await client.query(`SELECT honorific, first_name, last_name, constituency, party, 'Ontario' AS province_territory, 'Provincial' AS gov_level FROM ontario_mpps;`);

    res.status(200).json(reps.rows); 
    client.release();
    return true;
  } catch (error) {
    res.status(500).json({ message: 'Error connecting to database.' });
    console.error(`Could not GET from Ontario table.`);
    throw error; 
  }
});

router.get('/ontario/:member_id', async (req: Request, res: Response) => {
  const member_id = req.params.member_id.toLowerCase();
  const repStatement = `
    ${repSelect}
    ${ontarioSelect}
    FROM ontario_mpps WHERE member_id = '${member_id}';
  `;

  try {
    const client = await pool.connect();

    const reps = await client.query(repStatement);

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
