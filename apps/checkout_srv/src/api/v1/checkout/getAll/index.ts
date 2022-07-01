
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/checkouts')
class GetOrderController extends Controller {
  async send(): Promise<any> {
    const where = {};
    const offset = {};
    const options = {};

    const data = super.query;
    const db = super.plugin.get('db');

    const Order = db.models['Order'];
    const Product = db.models['Product'];
    const Payment = db.models['Payment'];
    const Address = db.models['Address'];
    const Delivery = db.models['Delivery'];
    const Currency = db.models['Currency'];
    const Customer = db.models['Customer'];
    const Description = db.models['Description'];
    const OrderStatus = db.models['OrderStatus'];


    if ('limit' in data) {
      options['limit'] = Number(data['limit']);
    }

    if (('skip' in data) && ('take' in data)) {
      offset['offset'] = Number(data['skip']);
      offset['limit'] = Number(data['take']);
    }

    const result = await Order.findAndCountAll({
      where,
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
        {
          model: Description,
          attributes: ['value'],
          as: 'description',
        },
      ],
    });

    return new Result()
      .data(result['rows'].map((item) => item.toJSON()))
      .meta({
        totalRows: result['count'],
      })
      .build();
  }
}

export default GetOrderController