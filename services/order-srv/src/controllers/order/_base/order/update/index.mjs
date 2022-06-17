
import { models } from "@sellgar/db";


export default async function(orderUuid, data) {
  const { Order } = models;
  const orderData = {};

  if ('userUuid' in data) {
    orderData['userUuid'] = data['userUuid'];
  }

  if ('statusCode' in data) {
    orderData['statusCode'] = data['statusCode'];
  }

  if ('paymentCode' in data) {
    orderData['paymentCode'] = data['paymentCode'];
  }

  if ('title' in data) {
    orderData['title'] = data['title'];
  }

  if ('dateTo' in data) {
    orderData['dateTo'] = data['dateTo'];
  }

  if ('description' in data) {
    orderData['description'] = data['description'];
  }

  if ('total' in data) {
    if (/^\d+(\.\d{,2})?$/.test(data['total'])) {
      orderData['total'] = data['total'];
    }
  }

  if ('currencyCode' in data) {
    orderData['currencyCode'] = data['currencyCode'];
  }

  await Order.update(orderData, {
    where: {
      uuid: orderUuid,
    },
  });
};