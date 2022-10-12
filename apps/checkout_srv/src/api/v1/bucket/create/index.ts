
import { Route, Result, Controller } from '@library/app';


@Route('post', '/api/v1/buckets')
class UpdateBucketController extends Controller {
  async send(): Promise<any> {
    const body = super.body;

    const db = super.plugin.get('db');
    const Bucket = db.model['Bucket'];
    const Product = db.model['Product'];
    const BucketProduct = db.model['BucketProduct'];

    await db.manager.transaction(async (entityManager) => {
      const repositoryBucket = entityManager.getRepository(Bucket);
      const repositoryBucketProduct = entityManager.getRepository(BucketProduct);

      const queryBuilderBucket = repositoryBucket.createQueryBuilder();
      const queryBuilderBucketProduct = repositoryBucketProduct.createQueryBuilder();


      await queryBuilderBucket
        .insert()
        .into(Bucket)
        .values({ uuid: body['bucketUuid'] })
        .orIgnore()
        .execute();


      const bucket = new Bucket();
      bucket['uuid'] = body['bucketUuid'];

      const product = new Product();
      product['uuid'] = body['productUuid'];

      await queryBuilderBucketProduct
        .insert()
        .into(BucketProduct)
        .values({
          bucket: bucket,
          product: product,
          uuid: body?.['uuid'] || undefined,
          count: body['count'],
        })
        .onConflict(`("uuid") DO UPDATE SET "count" = :count`)
        .setParameter('count', body['count'])
        .execute();
    });

    return new Result()
      .data(null)
      .build();
  }
}

export default UpdateBucketController;
