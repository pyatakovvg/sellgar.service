
import DbPlugin from "@plugin/db";
import RabbitPlugin from "@plugin/rabbit";
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
  ]));

  app.addPlugin('db', new DbPlugin({
    host: process.env['DB_CONNECTION_HOST'],
    modelsPath: 'db/models',
  }));

  app.addPlugin('rabbit', new RabbitPlugin({
    host: process.env['RABBIT_CONNECTION_HOST'],
  }));

  await app.start();
})();
