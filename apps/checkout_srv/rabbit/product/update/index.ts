
export default async function init(rabbit, app) {
  await rabbit.bindToExchange(process.env['CHECKOUT_SRV_PRODUCT_UPDATE_QUEUE'] + '_' + Date.now(), process.env['PRODUCT_SRV_PRODUCT_UPDATE_EXCHANGE'], async (data, cb) => {
    const db = app.plugins['db'];

    const Product = db.models['Product'];

    const products = await Product.findAll({
      raw: true,
      where: {
        productUuid: data['uuid'],
      },
    });

    const bulk = [];

    for (let iIndex in data['modes']) {
      const mode = data['modes'][iIndex];
      for (let jIndex in products) {
        const product = products[jIndex];
        if (product['modeUuid'] === mode['uuid']) {
          bulk.push({
            ...product,
            externalId: data['externalId'],
            groupCode: data['groupCode'],
            categoryCode: data['categoryCode'],
            imageUuid: data?.['gallery']?.[0]?.['uuid'] ?? null,
            title: data['title'],
            originalName: data['originalName'],
            vendor: mode['vendor'],
            value: mode['value'],
            price: mode['price'],
          });
        }
      }
    }

    for (let index in bulk) {
      const product = bulk[index];
      await Product.update(product, {
        where: {
          uuid: product['uuid'],
        },
      });
    }

    cb(true);
  });
}