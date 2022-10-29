
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';

import customerBuilder from '../_builder/customer';


@Route('get', '/api/v1/customers')
class GetBucketController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query);
    const db = super.plugin.get('db');

    const Customer = db.model['Customer'];
    const queryBuilder = db.manager.createQueryBuilder(Customer, 'customer');

    if ('uuid' in query) {
      queryBuilder.andWhere('customer.uuid IN (:...customerUuid)', {
        customerUuid: query['uuid'],
      });
    }

    queryBuilder
      .addOrderBy('customer.createdAt', 'ASC');

    const result = await queryBuilder.getManyAndCount();

    return new Result()
      .data(result[0].map(customerBuilder))
      .meta({
        totalRows: result[1],
      })
      .build();
  }
}

export default GetBucketController;