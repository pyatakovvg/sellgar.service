
import RabbitPlugin from "@plugin/rabbit";
import DbTypeORMPlugin from "@plugin/type-orm";
import { Config, Application, Router } from '@library/app';


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
    import('./api/v1/folder/create'),
    import('./api/v1/folder/delete'),
  ]));

  app.addPlugin('db', new DbTypeORMPlugin({
    logging: true,
    host: process.env['DATABASE_HOST'],
    port: Number(process.env['DATABASE_PORT']),
    username: process.env['DATABASE_USERNAME'],
    password: process.env['DATABASE_PASSWORD'],
    database: process.env['DATABASE_DATABASE'],
    modelsPath: 'db/models',
  }));

  app.addPlugin('rabbit', new RabbitPlugin({
    host: process.env['RABBIT_CONNECTION_HOST'],
  }));

  await app.start();
})();
