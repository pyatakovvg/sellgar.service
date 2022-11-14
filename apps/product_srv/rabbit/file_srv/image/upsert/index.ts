
import Application from '@library/app';

export default async function init(rabbit, app: Application) {
  await rabbit.bindToExchange(
    process.env['PRODUCT_SRV_IMAGE_UPSERT_QUEUE'],
    process.env['FILE_SRV_IMAGE_UPSERT_EXCHANGE'],
  async (data, cb) => {
    const db = app.plugins['db'];
    const Image = db.model['Image'];

    const repository = db.manager.getRepository(Image);

    await repository.save(data.map((item: any) => ({
      uuid: item['uuid'],
      name: item['name'],
    })));

    cb(true);
  });
}
