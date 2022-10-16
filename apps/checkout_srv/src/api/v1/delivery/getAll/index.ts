
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/delivery')
class GetDeliveryController extends Controller {
  async send(): Promise<any> {
    const query = super.query;

    const db = super.plugin.get('db');
    const Delivery = db.model['Delivery'];

    const repository = db.manager.getRepository(Delivery);
    const queryBuilder = repository.createQueryBuilder('delivery')
      .select(['delivery.code', 'delivery.name', 'delivery.description', 'delivery.isUse'])
      .addOrderBy('delivery.order', 'ASC');


    if ('isUse' in query) {
      queryBuilder.andWhere('delivery.isUse = :isUse', { isUse: query['isUse'] })
    }

    const result = await queryBuilder.getMany();

    return new Result()
      .data(result)
      .build();
  }
}

export default GetDeliveryController;
