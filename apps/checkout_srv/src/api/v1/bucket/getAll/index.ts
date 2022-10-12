
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/buckets')
class GetBucketController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query);
    const db = super.plugin.get('db');

    const Bucket = db.model['Bucket'];
    const repositoryBucket = db.repository(Bucket);

    const queryBuilder = repositoryBucket
      .createQueryBuilder('bucket')
      .select(['bucket.uuid', 'bucket.createdAt', 'bucket.updatedAt']);

    if ('uuid' in query) {
      queryBuilder.andWhere('bucket.uuid IN (:...bucketUuid)', { bucketUuid: query['uuid'] })
    }

    queryBuilder
      .leftJoin('bucket.products', 'products')
      .addSelect(['products.uuid', 'products.count'])

      .leftJoin('products.product', 'product')
      .addSelect(['product.uuid', 'product.externalId', 'product.title', 'product.price',
        'product.groupCode', 'product.categoryCode'])

      .leftJoinAndSelect('product.image', 'image')
      .leftJoinAndSelect('product.currency', 'currency')

      .addOrderBy('products.createdAt', 'ASC');

    const result = await queryBuilder.getManyAndCount();

    return new Result()
      .data(result[0])
      .meta({
        totalRows: result[1],
      })
      .build();
  }
}

export default GetBucketController;