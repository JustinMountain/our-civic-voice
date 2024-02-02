import express, { Request, Response } from 'express';

const app = express();
const port = 3000;
const repRouter = require('./routes/representatives');
const officeRouter = require('./routes/offices');

/**
 * Handle get requests to the root of the API.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'The REST API is active!' });
});

/**
 * Handle get requests to the /representatives endpoint.
 */
app.use('/representatives', repRouter);

/**
 * Handle get requests to the /offices endpoint.
 */
app.use('/offices', officeRouter);

/**
 * Determines the port Express application listens on internally.
 */
app.listen(port, () => {
  console.log(`Server running on port ${port}!`);
});
