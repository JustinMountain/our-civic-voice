import express, { Request, Response } from 'express';

const app = express();
const port = 3000;
const repRouter = require('./routes/representatives');

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World!' });
});

app.use('/representatives', repRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}!`);
});
