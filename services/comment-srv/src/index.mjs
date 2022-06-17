
import logger from '@package/logger';
import { Server } from '@library/app';
import { connection as connectToDatabase } from '@sellgar/db';
import { connection as rabbitConnection } from "@sellgar/rabbit";

import routes from './routes';
import rabbit from './rabbit';


(async () => {
  try {
    await connectToDatabase(process.env['DB_CONNECTION_HOST'], {
      modelsPath: 'src/models'
    });
    await rabbitConnection(process.env['RABBIT_CONNECTION_HOST']);

    await rabbit();

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
