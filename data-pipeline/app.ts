import express, { Request, Response } from 'express';

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from './config/constants';
import { runAllUpdates } from './scripts/runAllUpdates';
import { runFederalUpdate } from './scripts/runFederalUpdate';
import { runOntarioUpdate } from './scripts/runOntarioUpdate';

const app = express();
const port = 3000;

app.get('/scripts/:scriptname', (req: Request, res: Response) => {
  const scriptName = req.params.scriptname;
  if (scriptName === 'runAllUpdates') {
    try {
      runAllUpdates();
      return;
    } catch (error) {
      console.error(`${CONSOLE_ERROR}Error updating all sources on GET request: ${CONSOLE_RESET}`, error);
      throw error;
    }
  }
  if (scriptName === 'runFederalUpdate') {
    try {
      runFederalUpdate();
      return;
    } catch (error) {
      console.error(`${CONSOLE_ERROR}Error updating all sources on GET request: ${CONSOLE_RESET}`, error);
      throw error;
    }
  }
  if (scriptName === 'runOntarioUpdate') {
    try {
      runOntarioUpdate();
      return;
    } catch (error) {
      console.error(`${CONSOLE_ERROR}Error updating all sources on GET request: ${CONSOLE_RESET}`, error);
      throw error;
    }
  }
  res.status(404).send("Script not found");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
