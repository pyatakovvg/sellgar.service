
import logger from '@package/logger';
import { Server } from '@library/app';
import { connection as connectToDatabase } from '@sellgar/db';
import { connection as connectToRabbit } from "@sellgar/rabbit";

import routes from './routes';


(async () => {
  try {
    await connectToDatabase(process.env['DB_CONNECTION_HOST'], {
      modelsPath: 'src/models'
    });
    await connectToRabbit(process.env['RABBIT_CONNECTION_HOST']);

    const server = new Server({
      server: {
        port: process.env['PORT'],
      },
      routes: [
        routes,
      ],
    });

    await server.start();
  }
  catch(error) {

    logger['error'](error);
  }
})();
