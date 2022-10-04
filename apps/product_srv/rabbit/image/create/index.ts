
import Application from '@library/app';

export default async function init(rabbit, app: Application) {
  await rabbit.bindToExchange(process.env['FILE_SRV_IMAGE_CREATE_QUEUE'] + '_' + Date.now(), process.env['FILE_SRV_IMAGE_CREATE_EXCHANGE'], async (data, cb) => {
    const db = app.plugins['db'];
    const Image = db.model['Image'];

    const repository = db.repository(Image);
    const queryBuilder = repository.createQueryBuilder();

    await queryBuilder
      .insert()
      .into(Image)
      .values(data.map((i: any) => ({ uuid: i['uuid'], name: i['name'] })))
      .execute();

    cb(true);
  });
}