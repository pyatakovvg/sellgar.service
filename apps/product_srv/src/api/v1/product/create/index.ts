
import { Route, Result, Controller } from '@library/app';


@Route('post', '/api/v1/products/create')
class CreateProductTemplateController extends Controller {
  async send(): Promise<any> {
    const body = super.body;

    const rabbit = super.plugin.get('rabbit');
    const db = super.plugin.get('db');
    const Product = db.model['Product'];


    let preloadData = {};
    const result = await db.repository(Product).save({});

    if ('externalId' in body) {
      preloadData['externalId'] = body['externalId'];
    }
    if ('name' in body) {
      preloadData['name'] = body['name'];
    }
    if ('description' in body) {
      preloadData['description'] = body['description'];
    }

    if ('isUse' in body) {
      preloadData['isUse'] = body['isUse'];
    }

    if ('groupUuid' in body) {
      preloadData['group'] = { uuid: body['groupUuid'] };
    }
    if ('categoryUuid' in body) {
      preloadData['category'] = { uuid: body['categoryUuid'] };
    }

    if ('attributes' in body) {
      preloadData['attributes'] = body['attributes'].map((group: any, index: number) => ({
        uuid: group['uuid'] || undefined,
        name: group['name'],
        values: group['values'].map((attribute: any, index: number) => ({
          uuid: attribute['uuid'],
          value: attribute['value'],
          order: index,
          attribute: {
            uuid: attribute['attributeUuid']
          }
        })),
        order: index,
      }));
    }

    await rabbit.sendEvent(process.env['PRODUCT_SRV_PRODUCT_UPSERT_EXCHANGE'], result);

    return new Result()
      .data({
        uuid: result['uuid'],
        ...preloadData,
      })
      .build();
  }
}

export default CreateProductTemplateController;
