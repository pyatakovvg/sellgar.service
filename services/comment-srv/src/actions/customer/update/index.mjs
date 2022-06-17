
import logger from "@package/logger";
import { models, sequelize } from '@sellgar/db';


export default async function update(data) {
  const { Customer } = models;
  const transaction = await sequelize.transaction();

  logger.info('Поиск пользователя: ' + JSON.stringify(data));

  try {
    const result = await Customer.findOne({
      where: {
        uuid: data['uuid'],
      },
      transaction,
    });

    const customer = result ? result.toJSON() : null;

    if (customer) {

      logger.info('Найден пользователь: ' + JSON.stringify(customer));
      logger.info('Данные на обновление: ' + JSON.stringify(data));

      await Customer.update({
        name: data['profile']['name'],
        phone: data['profile']['phone'],
        email: data['profile']['email'],
      }, {
        where: {
          uuid: data['uuid'],
        },
        transaction,
      });
    }
    else {

      logger.info('Пользователь не найден');
      logger.info('Данные на создание: ' + JSON.stringify(data));

      await Customer.create({
        uuid: data['uuid'],
        name: data['profile']['name'],
        phone: data['profile']['phone'],
        email: data['profile']['email'],
      }, {
        transaction,
      });
    }

    await transaction.commit();
  }
  catch (error) {

    await transaction.rollback();

    throw error;
  }
}
