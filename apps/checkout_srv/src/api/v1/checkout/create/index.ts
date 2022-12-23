
import { type EntityManager } from '@plugin/type-orm';
import { Route, Result, Controller } from '@library/app';

import bucketBuilder from './builders/bucket';


@Route('post', '/api/v1/checkouts')
class CreateCheckoutController extends Controller {
  async send(): Promise<any> {
    const body = super.body;

    // console.log(body);

    const db = super.plugin.get('db');
    // const rabbit = super.plugin.get('rabbit');

    const Bucket = db.model['Bucket'];
    const Checkout = db.model['Checkout'];
    // const PaymentDetail = db.model['PaymentDetail'];
    // const CheckoutDetail = db.model['CheckoutDetail'];
    // const CheckoutProduct = db.model['CheckoutProduct'];

    const result = await db.manager.transaction(async (entityManager: EntityManager) => {
      const bucketRepository = entityManager.getRepository(Bucket);
      const checkoutRepository = entityManager.getRepository(Checkout);
      // const paymentDetailRepository = entityManager.getRepository(PaymentDetail);
      // const checkoutDetailRepository = entityManager.getRepository(CheckoutDetail);
      // const checkoutProductRepository = entityManager.getRepository(CheckoutProduct);

      const bucketResult = await bucketRepository.createQueryBuilder('bucket')
        .where('bucket.customerUuid = :uuid', { uuid: body['customerUuid'] })
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
        details: body['details'],
        products: bucket.products.map((product) => ({
          count: product['count'],
          price: product['product']['price'],
          currency: product['product']['currency'],
          store: product['product'],
        })),
      };

      const checkout = await checkoutRepository.save(checkoutData, { reload: true });

      // if (body['paymentCode'] === 'online') {
      //   const result = await rabbit.sendCommand(process.env['PIKASSA_SRV_PAYMENT_CREATE_QUEUE'], '', { reply: true })

      //   if ( ! result['success']) {
      //     throw new InternalServerError({ code: '100.1.1', message: 'Ошибка при выставлении счета' });
      //   }

      //   await paymentDetailRepository.save([{
      //     checkout,
      //     name: 'paymentLink',
      //     value: result['data']['paymentLink'],
      //     payment: { code: body['paymentCode'] },
      //   }]);
      // }

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
