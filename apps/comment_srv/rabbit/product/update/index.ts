
export default async function init(rabbit, app) {
  await rabbit.bindToExchange(process.env['QUEUE_PRODUCT_UPDATE'] + '_' + Date.now(), process.env['EXCHANGE_PRODUCT_UPDATE'], async (data, cb) => {
    const product: any = JSON.parse(data);
    const db = app.plugins['db'];

    const Product = db.models['Product'];

    const hasProduct = await Product.count({ where: { uuid: product['uuid'] } })

    if ( ! hasProduct) {
      await Product.create({
        uuid: product['uuid'],
        externalId: product['externalId'],
        title: product['title'],
        originalName: product['originalName'],
      });
    }
    else {
      await Product.update({
        uuid: product['uuid'],
        externalId: product['externalId'],
        title: product['title'],
        originalName: product['originalName'],
      }, {
        where: { uuid: product['uuid'] }
      });
    }

    cb(true);
  });
}
