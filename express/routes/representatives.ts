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

/**
 * Handle GET request to retrieve all representatives from the database.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Boolean>} - A promise that resolves to true if successful.
 */
router.get('/', async (req: Request, res: Response): Promise<Boolean> => {
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

/**
 * Handle GET request to retrieve Federal representatives from the database.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Boolean>} - A promise that resolves to true if successful.
 */
router.get('/federal', async (req: Request, res: Response): Promise<Boolean> => {
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

/**
 * Handle GET request to retrieve a specific Federal Member's info from the database.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Boolean>} - A promise that resolves to true if successful.
 */
router.get('/federal/:member_id', async (req: Request, res: Response): Promise<Boolean> => {
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

/**
 * Handle GET request to retrieve Ontario representatives from the database.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Boolean>} - A promise that resolves to true if successful.
 */
router.get('/ontario', async (req: Request, res: Response): Promise<Boolean> => {
  const repStatement = `
    ${repSelect}
    ${ontarioSelect}
    FROM ontario_mpps;
  `;

  try {
    const client = await pool.connect();
    const reps = await client.query(repStatement);

    res.status(200).json(reps.rows); 
    client.release();
    return true;
  } catch (error) {
    res.status(500).json({ message: 'Error connecting to database.' });
    console.error(`Could not GET from Ontario table.`);
    throw error; 
  }
});

/**
 * Handle GET request to retrieve a specific Ontario Member's info from the database.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Boolean>} - A promise that resolves to true if successful.
 */
router.get('/ontario/:member_id', async (req: Request, res: Response): Promise<Boolean> => {
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
