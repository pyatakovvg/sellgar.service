
import { models } from "@sellgar/db";


export default async function(orderUuid, address) {
  const { OrderAddress } = models;

  if (address) {

    await OrderAddress.create({
      orderUuid,
      ...address,
    });
  }
};