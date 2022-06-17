
import logger from '@package/logger';
import { Server } from '@library/app';
import connectToDatabase from '@sellgar/db';
import { connection as rabbitConnection } from "@sellgar/rabbit";

import webPush from 'web-push';

import routes from './routes';
import rabbit from './rabbit';


(async () => {
  try {
    await connectToDatabase(process.env['DB_CONNECTION_HOST']);
    await rabbitConnection(process.env['RABBIT_CONNECTION_HOST']);

    await rabbit();

    const server = new Server({
      cookie: {
        secret: process.env['JWT_SECRET'],
        name: process.env['COOKIE_NAME'],
        checkUrl: process.env['IDENTITY_API_SRV'] + '/check',
        refreshUrl: process.env['IDENTITY_API_SRV'] + '/refresh',
      },
      server: {
        port: process.env['PORT'],
        origins: process.env['HTTP_ORIGINS'],
      },
      socket: {
        path: process.env['SOCKET_PATH'],
      },
      routes: [
        routes,
      ],
    });

    webPush.setVapidDetails(process.env['PUSH_HOST'], process.env['PUBLIC_KEY'], process.env['PRIVATE_KEY']);

    await server.start();
  }
  catch(error) {

    logger['error'](error);
  }
})();
