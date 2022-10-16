
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/payments')
class GetPaymentController extends Controller {
  async send(): Promise<any> {
    const query = super.query;

    const db = super.plugin.get('db');
    const Payment = db.model['Payment'];

    const repository = db.manager.getRepository(Payment);
    const queryBuilder = repository.createQueryBuilder('payment')
      .select(['payment.code', 'payment.name', 'payment.description', 'payment.isUse'])
      .addOrderBy('payment.order', 'ASC');


    if ('isUse' in query) {
      queryBuilder.andWhere('payment.isUse = :isUse', { isUse: query['isUse'] })
    }

    const result = await queryBuilder.getMany();

    return new Result()
      .data(result)
      .build();
  }
}

export default GetPaymentController;
