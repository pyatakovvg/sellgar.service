
import { Route, Result, Controller } from '@library/app';

import bucketBuilder from '../_builder/bucket';
import BucketModel from '../_models/Bucket';


@Route('delete', '/api/v1/buckets')
class DeleteOrderController extends Controller {
  async send(): Promise<any> {
    const query = super.query;

    const db = super.plugin.get('db');
    const Bucket = db.model['Bucket'];
    const BucketProduct = db.model['BucketProduct'];


    const result = await db.manager.transaction(async (entityManager) => {
      const model = new BucketModel(db, entityManager);

      if (query['productUuid']) {
        const repository = entityManager.getRepository(BucketProduct);

        await repository.delete({
          bucket: {
            uuid: query['bucketUuid'],
            customer: {
              uuid: query['customerUuid'],
            }
          },
          product: {
            uuid: query['productUuid'],
          },
        });
      }
      else {
        const repository = entityManager.getRepository(Bucket);

        await repository.delete({
          uuid: query['bucketUuid'],
          customer: {
            uuid: query['customerUuid'],
          },
        });
      }

      return await model.getOne({
        bucketUuid: query['bucketUuid'],
        customerUuid: query['customerUuid'],
      });
    });

    return new Result()
      .data(result ? bucketBuilder(result) : null)
      .build();
  }
}

export default DeleteOrderController;
