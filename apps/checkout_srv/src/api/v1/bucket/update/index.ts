
import { Route, Result, Controller } from '@library/app';


@Route('put', '/api/v1/buckets/:uuid')
class UpdateBucketController extends Controller {
  async send(): Promise<any> {
    const body = super.body;
    const params = super.params;

    const db = super.plugin.get('db');
    const BucketProduct = db.model['BucketProduct'];

    await db.manager.transaction(async(entityManager) => {
      const repositoryBucketProduct = entityManager.getRepository(BucketProduct);
      const queryBuilder = repositoryBucketProduct.createQueryBuilder();

      await queryBuilder
        .update(BucketProduct)
        .set({ count: body['count'] })
        .where('bucketUuid = :bucketUuid AND uuid = :uuid', {
          uuid: body['uuid'],
          bucketUuid: params['uuid'],
        })
        .execute();
    });

    return new Result()
      .data(null)
      .build();
  }
}

export default UpdateBucketController;
