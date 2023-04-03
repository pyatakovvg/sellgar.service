
import { type EntityManager } from '@plugin/type-orm';
import { Route, Result, Controller } from '@library/app';

import bucketBuilder from './builders/bucket';


@Route('post', '/api/v1/checkouts')
class CreateCheckoutController extends Controller {
  async send() {
    const body = super.body;

    const db = super.plugin.get('db');
    // const rabbit = super.plugin.get('rabbit');

    const Bucket = db.model['Bucket'];
    const Checkout = db.model['Checkout'];

    const result = await db.manager.transaction(async (entityManager: EntityManager) => {
      const bucketRepository = entityManager.getRepository(Bucket);
      const checkoutRepository = entityManager.getRepository(Checkout);

      const bucketResult = await bucketRepository.createQueryBuilder('bucket')
        .where('bucket.customerUuid = :uuid', { uuid: body['customerUuid'] })
        .leftJoinAndSelect('bucket.products', 'products')
        .leftJoinAndSelect('products.product', 'product')
        .leftJoinAndSelect('product.currency', 'currency')
        .getOne();

       const bucket = bucketBuilder(bucketResult);

      const checkoutData = {
        status: { code: 'new' },
        payment: { code: body.paymentCode },
        delivery: { code: body.deliveryCode },
        customer: { uuid: body.customerUuid },
        details: body.details,
        price: bucket.price,
        currency: { code: bucket.currency.code },
        products: bucket.products.map((product) => ({
          count: product['count'],
          price: product['product']['price'],
          currency: { code: product.product.currency.code },
          store: { uuid: product.product.uuid },
        })),
      };

      const checkout = await checkoutRepository.save(checkoutData, { reload: true });

      await bucketRepository.delete({ uuid: bucket['uuid'] });

      return {
        uuid: checkout['uuid'],
      };
    });

    return new Result()
      .data(result)
      .build();
  }
}

export default CreateCheckoutController;
