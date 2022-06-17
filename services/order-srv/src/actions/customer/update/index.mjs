
import { models, sequelize } from '@sellgar/db';


export default async function update(data) {
  const { Customer } = models;
  const transaction = await sequelize.transaction();

  const result = await Customer.findOne({
    where: {
      uuid: data['userUuid'],
    },
    transaction,
  });

  const customer = result.toJSON();

  if (customer) {

    await Customer.update({
      uuid: data['userUuid'],
      customerUuid: data['uuid'],
      type: data['type'],
      name: data['name'],
      phone: data['phone'],
      email: data['email'],
    }, {
      where: {
        customerUuid: data['uuid'],
      },
      transaction,
    });
  }
  else {

    await Customer.create({
      uuid: data['userUuid'],
      customerUuid: data['uuid'],
      name: data['name'],
      phone: data['phone'],
      email: data['email'],
    }, {
      transaction,
    });
  }

  await transaction.commit();
}
