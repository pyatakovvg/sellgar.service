
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';

import bucketBuilder from '../_builder/bucket';


@Route('get', '/api/v1/buckets')
class GetBucketController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query);
    const db = super.plugin.get('db');

    const Bucket = db.model['Bucket'];
    const repository = db.repository(Bucket);

    const queryBuilder = repository.createQueryBuilder('bucket')

    if ('uuid' in query) {
      queryBuilder.andWhere('bucket.uuid IN (:...bucketUuid)', {
        bucketUuid: query['uuid'],
      });
    }

    if ('customerUuid' in query) {
      queryBuilder.innerJoin('bucket.customer', 'customer', 'customer.uuid IN (:...customerUuid)', {
        customerUuid: query['customerUuid'],
      });
    }

    queryBuilder
      .leftJoinAndSelect('bucket.currency', 'b_currency')
      .leftJoinAndSelect('bucket.products', 'products')
        .leftJoinAndSelect('products.product', 'product')
          .leftJoinAndSelect('product.currency', 'p_currency')
          .leftJoinAndSelect('product.product', 'catalog_product')
            .leftJoinAndSelect('catalog_product.catalog', 'catalog')
             .leftJoinAndSelect('catalog.image', 'image');

    queryBuilder
      .addOrderBy('products.order', 'ASC');

    const result = await queryBuilder.getManyAndCount();

    return new Result()
      .data(result[0].map(bucketBuilder))
      .meta({
        totalRows: result[1],
      })
      .build();
  }
}

export default GetBucketController;