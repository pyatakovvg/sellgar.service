
export default async function init(rabbit, app) {
  await rabbit.bindToExchange(process.env['CHECKOUT_SRV_IMAGE_DELETE_QUEUE'] + '_' + Date.now(), process.env['FILE_SRV_IMAGE_DELETE_EXCHANGE'], async (data, cb) => {
    const db = app.plugins['db'];

    const Product = db.models['Product'];

    const products = await Product.findAll({
      where: {
        imageUuid: data,
      },
    });

    for (let index in products) {
      const product = products[index].toJSON();
      await Product.update({
        imageUuid: null,
      }, {
        where: {
          uuid: product['uuid'],
        },
      });
    }

    cb(true);
  });
}