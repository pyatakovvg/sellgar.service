
import { models } from "@sellgar/db";


export default async function(data) {
  const { Order } = models;

  const result = await Order.create({
    userUuid: data['userUuid'],
    statusCode: data['statusCode'],
    paymentCode: data['paymentCode'],
    title: data['title'],
    dateTo: data['dateTo'],
    description: data['description'],
    total: data['total'],
    currencyCode: data['currencyCode'],
  });

  return result['uuid'];
};