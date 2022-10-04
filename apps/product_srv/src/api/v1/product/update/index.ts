
import { Route, Result, Controller } from '@library/app';


@Route('put', '/api/v1/products/:uuid')
class UpdateProductTemplateController extends Controller {
  async send(): Promise<any> {
    const body = super.body;
    const params = super.params;

    const db = super.plugin.get('db');
    const Product = db.model['Product'];

    const repProduct = db.repository(Product);

    let preloadData = {};

    if ('externalId' in body) {
      preloadData['externalId'] = body['externalId'];
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

    console.log(product)

    await repProduct.save(product, {

    });

    return new Result()
      .data(null)
      .build();
  }
}

export default UpdateProductTemplateController;
