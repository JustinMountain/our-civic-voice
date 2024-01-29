import express, { Request, Response } from 'express';
import pool from '../config/databasePool';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();

    const reps = await client.query(`SELECT * FROM all_representatives;`);

    res.status(200).json(reps.rows); 
    client.release();
    return true;
  } catch (error) {
    console.error(`Could not GET from All Representative view.`);
    throw error; 
  }
});

router.get('/:constituency', async (req: Request, res: Response) => {
  const constituency = req.params.constituency.toLowerCase();
  try {
    const client = await pool.connect();

    const reps = await client.query(`SELECT honorific, first_name, last_name, constituency, party, province_territory FROM all_representatives WHERE LOWER(constituency) = '${constituency}';`);

    res.status(200).json(reps.rows); 
    client.release();
    return true;
  } catch (error) {
    console.error(`Could not GET from Federal table.`);
    throw error; 
  }
});

router.get('/federal', async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();

    const reps = await client.query(`SELECT honorific, first_name, last_name, constituency, party, province_territory FROM federal_mps;`);

    res.status(200).json(reps.rows); 
    client.release();
    return true;
  } catch (error) {
    console.error(`Could not GET from Federal table.`);
    throw error; 
  }
});

router.get('/federal/:constituency', async (req: Request, res: Response) => {
  const constituency = req.params.constituency.toLowerCase();
  try {
    const client = await pool.connect();

    const reps = await client.query(`SELECT honorific, first_name, last_name, constituency, party, province_territory FROM federal_mps WHERE LOWER(constituency) = '${constituency}';`);

    res.status(200).json(reps.rows); 
    client.release();
    return true;
  } catch (error) {
    console.error(`Could not GET from Federal table.`);
    throw error; 
  }
});

router.get('/ontario', async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();

    const reps = await client.query(`SELECT honorific, first_name, last_name, constituency, party, 'ontario' AS province_territory FROM ontario_mpps;`);

    res.status(200).json(reps.rows); 
    client.release();
    return true;
  } catch (error) {
    console.error(`Could not GET from Ontario table.`);
    throw error; 
  }
});

router.get('/ontario/:constituency', async (req: Request, res: Response) => {
  const constituency = req.params.constituency.toLowerCase();
  try {
    const client = await pool.connect();

    const reps = await client.query(`SELECT honorific, first_name, last_name, constituency, party, 'ontario' AS province_territory FROM ontario_mpps WHERE LOWER(constituency) = '${constituency}';`);

    res.status(200).json(reps.rows); 
    client.release();
    return true;
  } catch (error) {
    console.error(`Could not GET from Federal table.`);
    throw error; 
  }
});

module.exports = router;
