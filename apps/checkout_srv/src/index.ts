
import DbPlugin from "@plugin/db";
import { Config, Application, Router } from '@library/app';


(async function() {

  const app = new Application(new Config({
    port: Number(process.env['PORT']),
  }));

  app.addRouter(new Router([
    import('./api/v1/delivery/getAll'),

    import('./api/v1/payment/getAll'),

    import('./api/v1/checkout/get'),
    import('./api/v1/checkout/getAll'),
    import('./api/v1/checkout/update'),
  ]));

  app.addPlugin('db', new DbPlugin({
    host: process.env['DB_CONNECTION_HOST'],
    modelsPath: 'db/models',
  }));

  await app.start();
})();
