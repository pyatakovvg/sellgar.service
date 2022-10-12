
import Application from '@library/app';


export default async function init(rabbit, app: Application) {
  await rabbit.bindToExchange(
    process.env['CHECKOUT_SRV_PRODUCT_CREATE_QUEUE'] + '_' + Date.now(),
    process.env['PRODUCT_SRV_PRODUCT_CREATE_EXCHANGE'],
  async (data, cb) => {
    const db = app.plugins['db'];
    const Product = db.model['Product'];
    const repository = db.repository(Product);

    await repository.upsert({
      uuid: data['uuid'],
      externalId: data['externalId'],
      title: data['title'],
      vendor: data['vendor'],
    }, ['uuid']);

    cb(true);
  });
}