
export default async function init(rabbit, app) {
  await rabbit.bindToExchange(process.env['QUEUE_PRODUCT_CREATE'] + '_' + Date.now(), process.env['EXCHANGE_PRODUCT_CREATE'], async (data, cb) => {
    const product: any = JSON.parse(data);
    const db = app.plugins['db'];

    const Product = db.models['Product'];

    await Product.create({
      uuid: product['uuid'],
      externalId: product['externalId'],
      title: product['title'],
      originalName: product['originalName'],
    });

    cb(true);
  });
}
