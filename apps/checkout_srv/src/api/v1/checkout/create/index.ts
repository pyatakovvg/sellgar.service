
import { Route, Result, Controller } from '@library/app';

import bucketBuilder from './builders/bucket';


@Route('post', '/api/v1/checkouts')
class CreateCheckoutController extends Controller {
  async send(): Promise<any> {
    const body = super.body;

    const db = super.plugin.get('db');

    const Bucket = db.model['Bucket'];
    const Checkout = db.model['Checkout'];
    const CheckoutDetail = db.model['CheckoutDetail'];
    const CheckoutProduct = db.model['CheckoutProduct'];

    const result = await db.manager.transaction(async (entityManager) => {
      const bucketRepository = entityManager.getRepository(Bucket);
      const checkoutRepository = entityManager.getRepository(Checkout);
      const checkoutDetailRepository = entityManager.getRepository(CheckoutDetail);
      const checkoutProductRepository = entityManager.getRepository(CheckoutProduct);

      const bucketResult = await bucketRepository.createQueryBuilder('bucket')
        .where('bucket.uuid = :uuid', { uuid: body['bucketUuid'] })
        .leftJoinAndSelect('bucket.products', 'products')
        .leftJoinAndSelect('products.product', 'product')
        .leftJoinAndSelect('product.currency', 'currency')
        .getOne();
      const bucket = bucketBuilder(bucketResult);

      const checkoutData = {
        status: { code: 'new' },
        payment: {
          code: body['paymentCode'],
        },
        delivery: {
          code: body['deliveryCode'],
        },
        price: bucket['price'],
        currency: bucket['currency'],
      };

      const checkout = await checkoutRepository.save(checkoutData, { reload: true });

      await checkoutDetailRepository.save(body['details'].map((detail: any) => ({
        checkout,
        ...detail,
      })));
      await checkoutProductRepository.save(bucket['products'].map((product: any) => {
        return {
          checkout,
          count: product['count'],
          price: product['product']['price'],
          currency: product['product']['currency'],
          product: product['product']['uuid'],
        };
      }));

      await bucketRepository.delete({ uuid: bucket['uuid'] });

      return {
        uuid: checkout['uuid'],
      }
    });

    return new Result()
      .data(result)
      .build();
  }
}

export default CreateCheckoutController;
