
import { Route, Result, Controller } from '@library/app';


@Route('put', '/api/v1/products/:uuid')
class UpdateProductTemplateController extends Controller {
  async send(): Promise<any> {
    const body = super.body;
    const params = super.params;

    const rabbit = super.plugin.get('rabbit');
    const db = super.plugin.get('db');
    const Product = db.model['Product'];

    const repProduct = db.repository(Product);

    let preloadData = {};

    if ('externalId' in body) {
      preloadData['externalId'] = body['externalId'];
    }
    if ('barcode' in body) {
      preloadData['barcode'] = body['barcode'];
    }
    if ('vendor' in body) {
      preloadData['vendor'] = body['vendor'];
    }

    if ('title' in body) {
      preloadData['title'] = body['title'];
    }
    if ('description' in body) {
      preloadData['description'] = body['description'];
    }

    if ('isUse' in body) {
      preloadData['isUse'] = body['isUse'];
    }
    if ('isAvailable' in body) {
      preloadData['isAvailable'] = body['isAvailable'];
    }

    if ('price' in body) {
      preloadData['price'] = body['price'];
    }
    if ('purchasePrice' in body) {
      preloadData['purchasePrice'] = body['purchasePrice'];
    }
    if ('currencyCode' in body) {
      preloadData['currency'] = { code: body['currencyCode'] };
    }

    if ('brandUuid' in body) {
      preloadData['brand'] = { uuid: body['brandUuid'] };
    }
    if ('groupUuid' in body) {
      preloadData['group'] = { uuid: body['groupUuid'] };
    }
    if ('categoryUuid' in body) {
      preloadData['category'] = { uuid: body['categoryUuid'] };
    }

    if ('images' in body) {
      preloadData['images'] = body['images'].map((image: any, index: number) => ({
        image: { uuid: image['uuid'] },
        order: index,
      }));
    }

    if ('attributes' in body) {
      preloadData['attributes'] = body['attributes'].map((group: any, index: number) => ({
        uuid: group['uuid'] || undefined,
        name: group['name'],
        values: group['values'].map((attribute: any, index: number) => ({
          uuid: attribute['uuid'],
          value: attribute['value'],
          attribute: { uuid: attribute['attributeUuid'] },
          order: index,
        })),
        order: index,
      }));
    }

    const product = await repProduct.preload({
      uuid: params['uuid'],
      ...preloadData,
    });

    const result = await repProduct.save(product);

    let queryBuilder = repProduct.createQueryBuilder('product')
      .where('product.uuid=:productUuid', { productUuid: result['uuid'] })
      .leftJoinAndSelect('product.images', 'product_image')
        .leftJoinAndSelect('product_image.image', 'images')
      .addOrderBy('product_image', 'ASC')
      .leftJoinAndSelect('product.group', 'group')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.currency', 'currency')
      .leftJoinAndSelect('product.attributes', 'attributes')
        .leftJoinAndSelect('attributes.values', 'values')
          .leftJoinAndSelect('values.attribute', 'value_attribute')
            .leftJoin('value_attribute.unit', 'unit');

    const updatedProduct = await queryBuilder.getOne();

    await rabbit.sendEvent(process.env['PRODUCT_SRV_PRODUCT_UPDATE_EXCHANGE'], updatedProduct);

    return new Result()
      .data(null)
      .build();
  }
}

export default UpdateProductTemplateController;
