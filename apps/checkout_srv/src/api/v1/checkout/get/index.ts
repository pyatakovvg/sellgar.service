
import { Route, Result, Controller } from '@library/app';
import uuid from "@helper/utils/lib/uuid";


@Route('get', '/api/v1/checkouts/:uuid')
class GetOrderController extends Controller {
  async send(): Promise<any> {
    const where = {};
    const params = super.params;
    const db = super.plugin.get('db');

    const Order = db.models['Order'];
    const Product = db.models['Product'];
    const Address = db.models['Address'];
    const Payment = db.models['Payment'];
    const Delivery = db.models['Delivery'];
    const Customer = db.models['Customer'];
    const Currency = db.models['Currency'];
    const Description = db.models['Description'];
    const OrderStatus = db.models['OrderStatus'];

    const result = await Order.findOne({
      where: {
        uuid: params['uuid'],
      },
      order: [
        ['createdAt', 'desc'],
      ],
      attributes: ['uuid', 'price', 'createdAt', 'updatedAt'],
      include: [
        {
          model: OrderStatus,
          attributes: ['code', 'displayName', 'description'],
          as: 'status',
        },
        {
          model: Description,
          attributes: ['value'],
          as: 'description',
        },
        {
          model: Customer,
          attributes: ['uuid', 'phone', 'email'],
          as: 'customer',
          include: [
            {
              model: Address,
              as: 'address',
            }
          ],
        },
        {
          model: Payment,
          attributes: ['code', 'displayName', 'description'],
          as: 'payment',
        },
        {
          model: Delivery,
          attributes: ['code', 'displayName', 'description'],
          as: 'delivery',
        },
        {
          model: Product,
          as: 'products',
          include: [
            {
              model: Currency,
              as: 'currency',
            }
          ],
        },
        {
          model: Currency,
          as: 'currency',
        },
      ],
    });

    return new Result()
      .data(result.toJSON())
      .build();
  }
}

export default GetOrderController