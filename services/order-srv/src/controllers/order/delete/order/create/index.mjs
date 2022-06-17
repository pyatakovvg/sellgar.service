
import { models } from "@sellgar/db";


export default async function(orderUuid, data) {
  const { Order } = models;

  await Order.update(data, {
    where: { uuid: orderUuid },
  });
};