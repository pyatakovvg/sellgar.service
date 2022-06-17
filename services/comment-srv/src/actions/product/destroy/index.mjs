
import logger from "@package/logger";
import { models } from '@sellgar/db';


export default async function(uuid) {
  const { Product } = models;

  logger.info('Данные на создание: ' + JSON.stringify(uuid));

  await Product.destroy({
    where: {
      uuid,
    },
  });
}
