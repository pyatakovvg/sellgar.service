
import { models } from "@sellgar/db";


export default async function(orderUuid, products) {
  const { OrderProduct } = models;

  if (products && !! products.length) {

    const productsBulk = products.map((item, index) => ({
      orderUuid: orderUuid,
      productUuid: item['productUuid'],
      externalId: item['externalId'],
      modeUuid: item['modeUuid'],
      imageUuid: item['imageUuid'] || null,
      title: item['title'],
      vendor: item['vendor'],
      value: item['value'],
      price: Number(item['price']),
      total: Number(item['price']),
      currencyCode: item['currencyCode'],
      number: Number(item['number']),
      order: index,
    }));

    await OrderProduct.bulkCreate(productsBulk);
  }
};