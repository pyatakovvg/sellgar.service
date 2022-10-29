
import { Route, Result, Controller } from '@library/app';

import BucketModel from '../_models/Bucket';
import bucketBuilder from '../_builder/bucket';


@Route('post', '/api/v1/buckets')
class UpdateBucketController extends Controller {
  async send(): Promise<any> {
    const body = super.body;

    const db = super.plugin.get('db');
    const Bucket = db.model['Bucket'];

    const model = new BucketModel(db);
    const repository = db.manager.getRepository(Bucket);

    const bucket = await repository.createQueryBuilder('bucket')
      .where('bucket.uuid = :bucketUuid', {
        bucketUuid: body['bucketUuid'],
      })
      .innerJoin('bucket.customer', 'customer', 'customer.uuid = :customerUuid', {
        customerUuid: body['customerUuid'],
      })
      .leftJoinAndSelect('bucket.products', 'products')
      .leftJoinAndSelect('products.product', 'product')
      .getOne();

    const product = await repository.createQueryBuilder('bucket')
      .where('bucket.uuid = :bucketUuid', {
        bucketUuid: body['bucketUuid'],
      })
      .innerJoin('bucket.customer', 'customer', 'customer.uuid = :customerUuid', {
        customerUuid: body['customerUuid'],
      })
      .innerJoin('bucket.products', 'products')
      .innerJoin('products.product', 'product', 'product.uuid = :productUuid', {
        productUuid: body['productUuid'],
      })
      .getOne();

    const bucketData = {
      uuid: bucket?.['uuid'],
      customer: {
        uuid: body['customerUuid'],
      },
      currency: {
        code: 'RUB',
      }
    };

    if ( ! product) {
      bucketData['products'] = [
        ...(bucket?.['products'] ?? []).map((item: any, index: number) => ({
          order: index,
          count: item['count'],
          product: {
            uuid: item['product']['uuid'],
          },
        })),
        {
          order: (bucket?.['products'] ?? []).length,
          count: body['count'],
          product: {
            uuid: body['productUuid'],
          }
        }
      ];
    }
    else {
      bucketData['products'] = (bucket?.['products'] ?? []).map((item: any, index: number) => {
        if (item['product']['uuid'] === body['productUuid']) {
          return {
            order: index,
            count: body['count'],
            product: {
              uuid: item['product']['uuid'],
            },
          }
        }
        return {
          order: index,
          count: item['count'],
          product: {
            uuid: item['product']['uuid'],
          },
        }
      });
    }

    const bucketUpdate = await repository.save(bucketData, { reload: true });

    const result = await model.getOne({
      bucketUuid: bucketUpdate['uuid'],
      customerUuid: bucketUpdate['customer']['uuid'],
    });

    return new Result()
      .data(result ? bucketBuilder(result) : null)
      .build();
  }
}

export default UpdateBucketController;
