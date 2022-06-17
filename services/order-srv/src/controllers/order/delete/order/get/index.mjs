
import { models } from '@sellgar/db';


export default async function(orderUuid) {
  const { Order, OrderProduct, Status } = models;

  const result = await Order.findOne({
    where: { uuid: orderUuid },
    attributes: ['uuid', 'userUuid', 'title', 'description', 'dateTo', 'createdAt', 'updatedAt'],
    include: [
      {
        model: Status,
        required: true,
        as: 'status',
      },
      {
        model: OrderProduct,
        required: false,
        attributes: ['uuid', 'orderUuid', 'productUuid', 'title', 'vendor', 'value', 'price', 'currencyCode'],
        as: 'products',
      }
    ],
  });

  return result.toJSON();
};
