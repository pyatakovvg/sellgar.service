
import { models } from "@sellgar/db";


export default async function(orderUuid) {
  const { OrderProduct } = models;

  await OrderProduct.destroy({
    where: {
      orderUuid,
    },
  });
};