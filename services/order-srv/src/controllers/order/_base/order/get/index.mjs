
import { models } from '@sellgar/db';


export default async function(orderUuid) {
  const { Order, Currency, OrderProduct, OrderAddress, Status, Payment, Customer } = models;

  const result = await Order.findOne({
    where: { uuid: orderUuid },
    order: [
      ['products', 'order', 'asc'],
    ],
    attributes: ['uuid', 'externalId', 'userUuid', 'title', 'description', 'dateTo', 'total', 'currencyCode', 'createdAt', 'updatedAt'],
    include: [
      {
        model: OrderAddress,
        attributes: ['city', 'street', 'house', 'building', 'apartment', 'front', 'floor'],
        as: 'address',
      },
      {
        model: OrderProduct,
        attributes: ['uuid', 'externalId', 'orderUuid', 'productUuid', 'modeUuid', 'imageUuid', 'title', 'vendor', 'value', 'price', 'total', 'number'],
        as: 'products',
        include: [
          {
            model: Currency,
            attributes: ['code', 'displayName'],
            as: 'currency',
          }
        ],
      },
      {
        model: Status,
        attributes: ['code', 'displayName'],
        as: 'status',
      },
      {
        model: Currency,
        attributes: ['code', 'displayName'],
        as: 'currency',
      },
      {
        model: Payment,
        attributes: ['code', 'displayName'],
        as: 'payment',
      },
      {
        model: Customer,
        attributes: ['uuid', 'name', 'phone', 'email'],
        as: 'customer',
      },
    ],
  });

  return result.toJSON();
};
