
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/checkouts')
class GetOrderController extends Controller {
  async send(): Promise<any> {
    const data = super.query;
    const db = super.plugin.get('db');

    const Checkout = db.model['Checkout'];
    const repository = db.repository(Checkout);
    const queryBuilder = repository
      .createQueryBuilder('checkout')
      .select(['checkout.uuid', 'checkout.externalId', 'checkout.createdAt', 'checkout.updatedAt']);



    const result = await queryBuilder.getManyAndCount();

    return new Result()
      .data(result[0])
      .meta({
        totalRows: result[1],
      })
      .build();
  }
}

export default GetOrderController