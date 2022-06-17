
import { UUID } from "@sellgar/utils";
import { sequelize, models } from "@sellgar/db";


export default async function(orderUuid, products) {
  const { OrderProduct } = models;

  const transaction = await sequelize.transaction();

  await OrderProduct.destroy({
    where: { orderUuid },
    transaction,
  });

  if (products && !! products.length) {

    await OrderProduct.bulkCreate(products.map((item) => ({
      uuid: UUID(),
      orderUuid: orderUuid,
      productUuid: item['productUuid'],
      title: item['title'],
      vendor: item['vendor'],
      value: item['value'],
      price: item['price'],
      currencyCode: item['currencyCode'],
      number: Number(item['number']),
    })), {
      transaction,
    });
  }

  await transaction.commit();
};