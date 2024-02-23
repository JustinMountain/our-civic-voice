import express, { Request, Response } from 'express';

import { CONSOLE_HIGHLIGHT, CONSOLE_ERROR, CONSOLE_RESET } from './etl/config/constants';
import { runAllUpdates } from './scripts/runAllUpdates';
import { runFederalPipeline } from './etl/pipelines/runFederalPipeline';
import { runOntarioPipeline } from './etl/pipelines/runOntarioPipeline';

const app = express();
const port = 3000;

// Mapping script names to their respective functions
const scriptActions = {
  'all': runAllUpdates,
  'federal': runFederalPipeline,
  'ontario': runOntarioPipeline,
};

/**
 * Creates an endpoint to run different database update scripts.
 */
app.get('/scripts/update/:scriptname', async (req: Request, res: Response) => {
  const scriptName = req.params.scriptname.toLowerCase();
  const scriptToRun = scriptActions[scriptName as keyof typeof scriptActions];

  if (scriptToRun) {
    try {
      await scriptToRun();
      console.log(`${CONSOLE_HIGHLIGHT}Script "${scriptName}" executed successfully${CONSOLE_RESET}`)
      res.send("Script executed successfully");
    } catch (error) {
      console.error(`${CONSOLE_ERROR}Error executing ${scriptName}: ${CONSOLE_RESET}`, error);
      res.status(500).send(`Error executing the script. Check the logs for more details.`);
    }
  } else {
    res.status(404).send("Script not found.");
  }

});

/**
 * Determines the port Express wrapper listens on internally.
 */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
