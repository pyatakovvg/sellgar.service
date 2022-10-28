
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

     const model = new BucketModel(db);

    if (query['productUuid']) {
      const repository = db.manager.getRepository(BucketProduct);

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
      const repository = db.manager.getRepository(Bucket);

      await repository.delete({
        uuid: query['bucketUuid'],
        customer: {
          uuid: query['customerUuid'],
        },
      });
    }

    const result = await model.getOne({
      bucketUuid: query['bucketUuid'],
      customerUuid: query['customerUuid'],
    });

    return new Result()
      .data(result ? bucketBuilder(result) : null)
      .build();
  }
}

export default DeleteOrderController;
