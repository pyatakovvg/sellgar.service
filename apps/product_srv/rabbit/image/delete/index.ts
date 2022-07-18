
export default async function init(rabbit, app) {
  await rabbit.bindToExchange(process.env['FILE_SRV_IMAGE_DELETE_QUEUE'] + '_' + Date.now(), process.env['FILE_SRV_IMAGE_DELETE_QUEUE'], async (data, cb) => {
    const uuid = JSON.parse(data);
    const db = app.plugins['db'];

    const ProductGallery = db.models['ProductGallery'];

    await ProductGallery.destroy({
      where: {
        imageUuid: uuid,
      },
    });

    cb(true);
  });
}