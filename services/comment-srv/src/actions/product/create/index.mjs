
import logger from "@package/logger";
import { models } from '@sellgar/db';


export default async function(data) {
  const { Product } = models;

  logger.info('Данные на создание: ' + JSON.stringify(data));

  await Product.create({
    uuid: data['uuid'],
    title: data['title'],
    isUse: data['isUse'],
    isAvailable: data['isAvailable'],
  });
}
