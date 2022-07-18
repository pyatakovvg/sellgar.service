
export default async function init(rabbit, app) {
  await rabbit.bindToExchange(process.env['COMMENT_SRV_PRODUCT_CREATE_QUEUE'] + '_' + Date.now(), process.env['PRODUCT_SRV_PRODUCT_CREATE_EXCHANGE'], async (data, cb) => {
    const db = app.plugins['db'];

    const Product = db.models['Product'];

    await Product.create({
      uuid: data['uuid'],
      externalId: data['externalId'],
      title: data['title'],
      originalName: data['originalName'],
    });

    cb(true);
  });
}
