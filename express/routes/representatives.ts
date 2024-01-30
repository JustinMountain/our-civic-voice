import express, { Request, Response } from 'express';
import pool from '../config/databasePool';

const router = express.Router();

// Route doesn't currently exist
// router.get('/', async (req: Request, res: Response) => {
//   try {
//     const client = await pool.connect();

//     const reps = await client.query(`SELECT * FROM all_representatives;`);

//     res.status(200).json(reps.rows); 
//     client.release();
//     return true;
//   } catch (error) {
//     res.status(500).json({ message: 'Error connecting to database.' });
//     console.error(`Could not GET from All Representative view.`);
//     throw error; 
//   }
// });

router.get('/federal', async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();

    const reps = await client.query(`SELECT honorific, first_name, last_name, constituency, party, province_territory, 'Federal' AS gov_level FROM federal_mps;`);

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
  try {
    const client = await pool.connect();

    const reps = await client.query(`SELECT honorific, first_name, last_name, constituency, party, 'Ontario' AS province_territory, 'Provincial' AS gov_level FROM ontario_mpps;`);

    res.status(200).json(reps.rows); 
    client.release();
    return true;
  } catch (error) {
    res.status(500).json({ message: 'Error connecting to database.' });
    console.error(`Could not GET from Ontario table.`);
    throw error; 
  }
});

// router.get('/:constituency', async (req: Request, res: Response) => {
//   const constituency = req.params.constituency.toLowerCase();
//   try {
//     const client = await pool.connect();

//     const reps = await client.query(`SELECT honorific, first_name, last_name, constituency, party, province_territory, gov_level FROM all_representatives WHERE LOWER(constituency) = '${constituency}';`);

//     res.status(200).json(reps.rows); 
//     client.release();
//     return true;
//   } catch (error) {
//     res.status(500).json({ message: 'Error connecting to database.' });
//     console.error(`Could not GET from Federal table.`);
//     throw error; 
//   }
// });

module.exports = router;
