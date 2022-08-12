
export default async function init(rabbit, app) {
  await rabbit.bindToExchange(process.env['COMMENT_SRV_PRODUCT_UPDATE_QUEUE'] + '_' + Date.now(), process.env['PRODUCT_SRV_PRODUCT_UPDATE_EXCHANGE'], async (product, cb) => {
    const db = app.plugins['db'];

    const Product = db.models['Product'];

    const hasProduct = await Product.count({ where: { uuid: product['uuid'] } })

    if ( ! hasProduct) {
      await Product.create({
        uuid: product['uuid'],
        externalId: product['externalId'],
        title: product['title'],
        originalName: product['originalName'],
        groupCode: product['group']?.['code'] ?? '',
        categoryCode: product['category']?.['code'] ?? '',
      });
    }
    else {
      await Product.update({
        uuid: product['uuid'],
        externalId: product['externalId'],
        title: product['title'],
        originalName: product['originalName'],
        groupCode: product['group']?.['code'] ?? '',
        categoryCode: product['category']?.['code'] ?? '',
      }, {
        where: { uuid: product['uuid'] }
      });
    }

    cb(true);
  });
}
