
import Application from '@library/app';


export default async function init(rabbit, app: Application) {
  await rabbit.bindToExchange(
    process.env['COMMENT_SRV_PRODUCT_UPSERT_QUEUE'] + '_' + Date.now(),
    process.env['PRODUCT_SRV_PRODUCT_UPSERT_EXCHANGE'],
  async (data, cb) => {
    const db = app.plugins['db'];
    const Product = db.model['Product'];

    const repository = db.manager.getRepository(Product);

    await repository.upsert({
      uuid: data['uuid'],
      externalId: data['externalId'],
      name: data['name'],
    }, ['uuid']);

    cb(true);
  });
}