/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
import { createServer } from 'http';

import logger from '../config/logger';
import configurationDetails from '../resources/config';
import { SecretManagerConfig } from '../resources/config/secretManager.config';

(async () => {
  await SecretManagerConfig.getSecretManagerValue();
  await require('../resources/config/parameterStore.config').getParamterStoreValue();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const app = require('../app');
  const normalizePort = (val: string) => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  };

  const port = normalizePort(configurationDetails.PORT || '4000');
  app.set('port', port);

  const errorHandler = (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

  const server = createServer(app);

  server.on('error', errorHandler);
  server.on('listening', () => {
    const addr = server.address();
    const bind =
      typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
    logger.info('Listening on ' + bind);
  });

  server.listen(port);
})();
