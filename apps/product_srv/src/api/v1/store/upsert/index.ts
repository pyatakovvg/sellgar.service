
import { Route, Result, Controller } from '@library/app';

import Store from '../_models/Store';


@Route('post', '/api/v1/store')
class UpdateProductTemplateController extends Controller {
  async send(): Promise<any> {
    const body = super.body;

    const rabbit = super.plugin.get('rabbit');

    const db = super.plugin.get('db');
    const store = new Store(db);

    const item = await store.save({
      uuid: body?.['uuid'],
      name: body['name'],
      brand: {
        uuid: body?.['brand']?.['uuid'] ?? null,
      },
      description: body['description'],
      vendor: body['vendor'],
      barcode: body['barcode'],
      count: body['count'],
      reserve: body['reserve'],
      price: Number(body['price']),
      purchasePrice: Number(body['purchasePrice']),
      currency: {
        code: body?.['currency']?.['code'] ?? null,
      }
    });
    const result = await store.getOne(item['uuid']);

    await rabbit.sendEvent(process.env['PRODUCT_SRV_STORE_PRODUCT_UPSERT_EXCHANGE'], result);

    return new Result()
      .data(result)
      .build();
  }
}

export default UpdateProductTemplateController;
