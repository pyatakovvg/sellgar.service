
import { queryNormalize } from '@helper/utils';
import { Controller, Result, Route } from '@library/app';

import storeBuilder from './builder/store';


@Route('get', '/api/v1/store')
class GetStoreController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query);

    const db = super.plugin.get('db');
    const Store = db.model['Store'];

    const queryBuilder = db.manager.createQueryBuilder(Store, 'store');

    queryBuilder
      .select([
        'store.uuid',
        'store.name', 'store.description',
        'store.price', 'store.purchasePrice',
        'store.count', 'store.reserve',
        'store.vendor', 'store.barcode',
        'store.createdAt', 'store.updatedAt'
      ])
      .leftJoinAndSelect('store.currency', 'currency')
      .addOrderBy('store.price', 'ASC')
      .addOrderBy('store.createdAt', 'ASC');

    if ('uuid' in query) {
      queryBuilder
        .andWhere('store.uuid IN (:...uuid)', { uuid: query['uuid'] });
    }

    if (('skip' in query) && ('take' in query)) {
      queryBuilder
        .limit(Number(query['take']))
        .offset(Number(query['skip']));
    }

    const result = await queryBuilder.getManyAndCount();

    return new Result()
      .data(result[0].map(storeBuilder))
      .meta({
        totalRows: result[1],
      })
      .build();
  }
}

export default GetStoreController;
