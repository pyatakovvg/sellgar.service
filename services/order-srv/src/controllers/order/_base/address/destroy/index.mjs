
import { models } from "@sellgar/db";


export default async function(orderUuid) {
  const { OrderAddress } = models;

  await OrderAddress.destroy({
    where: {
      orderUuid,
    }
  });
};