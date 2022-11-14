
import Application from '@library/app';


export default async function init(rabbit, app: Application) {
  await rabbit.bindToExchange(
    process.env['CHECKOUT_SRV_CATALOG_UPSERT_QUEUE'],
    process.env['PRODUCT_SRV_CATALOG_UPSERT_EXCHANGE'],
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
      product: {
        uuid:  data?.['product']?.['uuid'] ?? null,
      },
    });

    cb(true);
  });
}