
import RabbitPlugin from "@plugin/rabbit";
import DbTypeORMPlugin from "@plugin/type-orm";
import { Config, Application, Router } from '@library/app';


(async function() {

  const app = new Application(new Config({
    port: Number(process.env['PORT']),
  }));

  app.addRouter(new Router([
    import('./api/v1/product/getBrands'),
    import('./api/v1/product/getGroups'),
    import('./api/v1/product/getCategories'),
    import('./api/v1/product/getAttributes'),

    import('./api/v1/product/getAll'),
    import('./api/v1/product/update'),
    import('./api/v1/product/create'),

    import('./api/v1/currency/getAll'),

    import('./api/v1/unit/getAll'),
    import('./api/v1/unit/upsert'),
    import('./api/v1/unit/delete'),

    import('./api/v1/attribute/getAll'),
    import('./api/v1/attribute/upsert'),
    import('./api/v1/attribute/delete'),

    import('./api/v1/brand/getAll'),
    import('./api/v1/brand/upsert'),
    import('./api/v1/brand/delete'),

    import('./api/v1/group/getAll'),
    import('./api/v1/group/upsert'),
    import('./api/v1/group/delete'),

    import('./api/v1/category/getAll'),
    import('./api/v1/category/upsert'),
    import('./api/v1/category/delete'),

    import('./api/v1/comment/getAll'),
    import('./api/v1/comment/create'),
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
