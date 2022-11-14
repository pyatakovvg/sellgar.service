
import Application from '@library/app';


export default async function init(rabbit, app: Application) {
  await rabbit.bindToExchange(
    process.env['CHECKOUT_SRV_STORE_PRODUCT_UPSERT_QUEUE'],
    process.env['PRODUCT_SRV_STORE_PRODUCT_UPSERT_EXCHANGE'],
  async (data, cb) => {
    const db = app.plugins['db'];
    const Store = db.model['Store'];

    const repository = db.repository(Store);

    await repository.save({
      uuid: data['uuid'],
      name: data['name'],
      vendor: data['vendor'],
      barcode: data['barcode'],
      price: data['price'],
      currency: data['currency'],
      brandCode: data?.['brand']?.['code'] ?? null,
    });

    cb(true);
  });
}