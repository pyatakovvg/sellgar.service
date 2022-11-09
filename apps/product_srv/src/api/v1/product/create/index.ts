
import { Route, Result, Controller } from '@library/app';


@Route('post', '/api/v1/products/create')
class CreateProductTemplateController extends Controller {
  async send(): Promise<any> {
    const rabbit = super.plugin.get('rabbit');
    const db = super.plugin.get('db');
    const Product = db.model['Product'];

    const result = await db.manager.getRepository(Product).save({});

    await rabbit.sendEvent(process.env['PRODUCT_SRV_CATALOG_UPSERT_EXCHANGE'], result);

    return new Result()
      .data({
        uuid: result['uuid'],
      })
      .build();
  }
}

export default CreateProductTemplateController;
