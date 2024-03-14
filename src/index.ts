/* eslint-disable @typescript-eslint/no-unsafe-call */
import './pre-start'; // Must be the first import
import logger from 'jet-logger';

import EnvVars from '@src/constants/EnvVars';
import server from './server';
import DatabaseService from './services/DatabaseService';

// **** Run **** //

const SERVER_START_MSG =
  'Express server started on port: ' + EnvVars.Port.toString();

DatabaseService.connect()
  .then(() => {
    server.listen(EnvVars.Port, () => logger.info(SERVER_START_MSG));
  })
  .catch((err) => {
    logger.err('Error connecting to database: ' + err);
  });
