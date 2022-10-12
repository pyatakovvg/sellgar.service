
import RabbitPlugin from "@plugin/rabbit";
import DbTypeORMPlugin from "@plugin/type-orm";
import { Config, Application, Router } from '@library/app';


(async function() {

  const app = new Application(new Config({
    port: Number(process.env['PORT']),
  }));

  app.addRouter(new Router([
    import('./api/v1/product/getAll'),

    import('./api/v1/comment/getAll'),
    import('./api/v1/comment/create'),
    import('./api/v1/comment/update'),
  ]));

  app.addPlugin('db', new DbTypeORMPlugin({
    logging: process.env['DATABASE_LOGGING'] === 'true',
    host: process.env['DATABASE_HOST'],
    port: Number(process.env['DATABASE_PORT']),
    username: process.env['DATABASE_USERNAME'],
    password: process.env['DATABASE_PASSWORD'],
    database: process.env['DATABASE_DATABASE'],
    modelsPath: 'db/models',
  }));

  app.addPlugin('rabbit', new RabbitPlugin({
    host: process.env['RABBIT_CONNECTION_HOST'],
    actionsPath: 'rabbit',
  }));

  await app.start();
})();
