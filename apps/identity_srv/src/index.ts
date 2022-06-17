
import DbPlugin from "@plugin/db";
import { Config, Application, Router } from '@library/app';


(async function() {

  const app = new Application(new Config({
    port: Number(process.env['PORT']),
  }));

  app.addRouter(new Router([
    import('./api/v1/claim/get'),
    import('./api/v1/claim/destroy'),

    import('./api/v1/token/check'),
    import('./api/v1/token/refresh'),

    import('./api/v1/auth/token'),

    import('./api/v1/user/getAll'),
  ]));

  app.addPlugin('db', new DbPlugin({
    host: process.env['DB_CONNECTION_HOST'],
    modelsPath: 'db/models',
  }));

  await app.start();
})();
