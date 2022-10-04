
import DbPlugin from "@plugin/db";
import RabbitPlugin from "@plugin/rabbit";
import { Config, Application, Router } from '@library/app';
import DbTypeORMPlugin from "@plugin/type-orm";


(async function() {

  const app = new Application(new Config({
    port: Number(process.env['PORT']),
  }));

  app.addRouter(new Router([
    import('./api/v1/image/get'),
    import('./api/v1/image/delete'),
    import('./api/v1/image/create'),
    import('./api/v1/image/getAll'),

    import('./api/v1/folder/getAll'),
  ]));

  app.addPlugin('db2', new DbTypeORMPlugin({
    logging: true,
    host: process.env['DATABASE_HOST'],
    port: Number(process.env['DATABASE_PORT']),
    username: process.env['DATABASE_USERNAME'],
    password: process.env['DATABASE_PASSWORD'],
    database: process.env['DATABASE_DATABASE'],
    modelsPath: 'db2/models',
  }));

  app.addPlugin('db', new DbPlugin({
    host: process.env['DB_CONNECTION_HOST'],
    modelsPath: 'db/models',
  }));

  app.addPlugin('rabbit', new RabbitPlugin({
    host: process.env['RABBIT_CONNECTION_HOST'],
  }));

  await app.start();
})();
