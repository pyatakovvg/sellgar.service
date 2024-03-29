
import Application from '@library/app';

export default async function init(rabbit, app: Application) {
  await rabbit.bindToExchange(
    process.env['CHECKOUT_SRV_IMAGE_DELETE_QUEUE'],
    process.env['FILE_SRV_IMAGE_DELETE_EXCHANGE'],
  async (uuid, cb) => {
    const db = app.plugins['db'];
    const Image = db.model['Image'];

    const repository = db.repository(Image);

    await repository
      .createQueryBuilder()
      .delete()
      .from(Image)
      .where('uuid = :uuid', { uuid })
      .execute();

    cb(true);
  }, {
    autoDelete: false,
  });
}