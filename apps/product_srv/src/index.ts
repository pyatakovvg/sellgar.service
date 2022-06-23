
import DbPlugin from "@plugin/db";
import { Config, Application, Router } from '@library/app';


(async function() {

  const app = new Application(new Config({
    port: Number(process.env['PORT']),
  }));

  app.addRouter(new Router([
    import('./api/v1/product/getAll'),
    import('./api/v1/product/update'),
    import('./api/v1/product/template'),
    import('./api/v1/product/update-only'),

    import('./api/v1/category/getAll'),
    import('./api/v1/category/create'),
    import('./api/v1/category/update'),

    import('./api/v1/currency/getAll'),

    import('./api/v1/unit/getAll'),
    import('./api/v1/unit/create'),
    import('./api/v1/unit/update'),

    import('./api/v1/attribute/getAll'),
    import('./api/v1/attribute/create'),
    import('./api/v1/attribute/update'),

    import('./api/v1/brand/getAll'),
    import('./api/v1/brand/create'),
    import('./api/v1/brand/update'),

    import('./api/v1/group/getAll'),
    import('./api/v1/group/create'),
    import('./api/v1/group/update'),
  ]));

  app.addPlugin('db', new DbPlugin({
    host: process.env['DB_CONNECTION_HOST'],
    modelsPath: 'db/models',
  }));

  await app.start();
})();
