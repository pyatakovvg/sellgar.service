
import Application from '@library/app';


export default async function init(rabbit, app: Application) {
  await rabbit.bindToExchange(
    process.env['CHECKOUT_SRV_PRODUCT_UPSERT_QUEUE'] + '_' + Date.now(),
    process.env['PRODUCT_SRV_PRODUCT_UPSERT_EXCHANGE'],
  async (data, cb) => {
    const db = app.plugins['db'];
    const Catalog = db.model['Catalog'];

    const repository = db.repository(Catalog);

    await repository.save({
      uuid: data['uuid'],
      externalId: data['externalId'],
      name: data['name'],
      isUse: data['isUse'],
      groupCode: data['group']?.['code'] ?? null,
      categoryCode: data['category']?.['code'] ?? null,
      image: data['images']?.[0]?.['image'] ?? null,
      products: data['products'].map((product) => ({
        label: product['label'],
        product: { uuid:  product['product']['uuid'] },
      })),
    });

    cb(true);
  });
}