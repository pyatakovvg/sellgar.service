
import { sequelize, models } from "@sellgar/db";


export default async function(orderUuid, products) {
  const { OrderProduct } = models;

  const transaction = await sequelize.transaction();

  await OrderProduct.destroy({
    where: {
      orderUuid,
    },
    transaction,
  });

  if (products && !! products.length) {

    await OrderProduct.bulkCreate(products.map((item, index) => ({
      orderUuid: orderUuid,
      externalId: item['externalId'],
      productUuid: item['productUuid'],
      modeUuid: item['modeUuid'],
      imageUuid: item['imageUuid'] || null,
      title: item['title'],
      vendor: item['vendor'],
      value: item['value'],
      price: item['price'],
      total: Number(item['total']),
      currencyCode: item['currencyCode'],
      number: Number(item['number']),
      order: index,
    })), {
      transaction,
    });
  }

  await transaction.commit();
};