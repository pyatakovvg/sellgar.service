
import Application from '@library/app';

export default async function init(rabbit, app: Application) {
  await rabbit.bindToExchange(
    process.env['CHECKOUT_SRV_CUSTOMER_UPSERT_QUEUE'],
    process.env['CUSTOMER_SRV_CUSTOMER_UPSERT_EXCHANGE'],
  async (data, cb) => {
    const db = app.plugins['db'];
    const Customer = db.model['Customer'];

    const repository = db.manager.getRepository(Customer);

    await repository.save({
      uuid: data['uuid'],
      name: data['name'],
      phone: data['phone'],
      email: data['email'],
    });

    cb(true);
  });
}