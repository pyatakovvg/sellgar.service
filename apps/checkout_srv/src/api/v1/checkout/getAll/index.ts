
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/checkouts')
class GetCheckoutController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query);
    const db = super.plugin.get('db');

    const Checkout = db.model['Checkout'];
    const repository = db.repository(Checkout);
    const queryBuilder = repository
      .createQueryBuilder('checkout')
      .select(['checkout.uuid', 'checkout.externalId', 'checkout.price', 'checkout.createdAt', 'checkout.updatedAt']);

    if ('uuid' in query) {
      queryBuilder.andWhere('checkout.uuid IN (:...checkoutUuid)', { checkoutUuid: query['uuid'] })
    }

    if ('externalId' in query) {
      queryBuilder.andWhere('checkout.externalId IN (:...checkoutExternalId)', { checkoutExternalId: query['externalId'] })
    }

    queryBuilder
      .leftJoinAndSelect('checkout.currency', 'c_currency')
      .leftJoinAndSelect('checkout.status', 'status');

    if ('statusCode' in query) {
      queryBuilder.andWhere('status.code IN (:...statusCode)', { statusCode: query['statusCode'] });
    }

    queryBuilder
      .leftJoinAndSelect('checkout.details', 'c_details')
      .leftJoinAndSelect('checkout.delivery', 'delivery')
        .leftJoinAndSelect('delivery.details', 'd_details');

    if ('deliveryCode' in query) {
      queryBuilder.andWhere('delivery.code IN (:...deliveryCode)', { deliveryCode: query['deliveryCode'] })
    }

    queryBuilder
      .leftJoinAndSelect('checkout.payment', 'payment')
        .leftJoinAndSelect('payment.details', 'p_details', 'p_details.checkoutUuid = "checkout"."uuid"');

    if ('paymentCode' in query) {
      queryBuilder.andWhere('payment.code IN (:...paymentCode)', { paymentCode: query['paymentCode'] })
    }

    queryBuilder
      .leftJoinAndSelect('checkout.products', 'products')
      .leftJoinAndSelect('products.currency', 'p_currency')
      .leftJoinAndSelect('products.product', 'product')
        .leftJoinAndSelect('product.image', 'image')

      .addOrderBy('checkout.createdAt', 'DESC');

    const result = await queryBuilder.getManyAndCount();

    return new Result()
      .data(result[0])
      .meta({
        totalRows: result[1],
      })
      .build();
  }
}

export default GetCheckoutController