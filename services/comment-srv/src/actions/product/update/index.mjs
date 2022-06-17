
import logger from "@package/logger";
import { models, sequelize } from '@sellgar/db';


export default async function update(data) {
  const { Product } = models;
  const transaction = await sequelize.transaction();

  logger.info('Поиск товара: ' + JSON.stringify(data));

  try {
    const result = await Product.findByPk(data['uuid'], {
      transaction,
    });

    const customer = result ? result.toJSON() : null;

    if (customer) {

      logger.info('Найден пользователь: ' + JSON.stringify(customer));
      logger.info('Данные на обновление: ' + JSON.stringify(data));

      await Product.update({
        title: data['title'],
        isUse: data['isUse'],
        isAvailable: data['isAvailable'],
      }, {
        where: {
          uuid: data['uuid'],
        },
        transaction,
      });
    }
    else {

      logger.info('Продукт не найден');
      logger.info('Данные на создание: ' + JSON.stringify(data));

      await Product.create({
        uuid: data['uuid'],
        title: data['title'],
        isUse: data['isUse'],
        isAvailable: data['isAvailable'],
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
