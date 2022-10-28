
import { Route, Result, Controller } from '@library/app';

import CatalogModel from "../_model/Catalog";
import catalogBuilder from '../_builder/catalog';


@Route('post', '/api/v1/products')
class UpdateProductTemplateController extends Controller {
  async send(): Promise<any> {
    const body = super.body;

    const db = super.plugin.get('db');
    const rabbit = super.plugin.get('rabbit');

    const catalog = new CatalogModel(db);

    const catalogUpdated = await catalog.save({
      ...body,
    });
    const result = await catalog.getOne(catalogUpdated['uuid']);

    await rabbit.sendEvent(process.env['PRODUCT_SRV_PRODUCT_UPSERT_EXCHANGE'], result);

    return new Result()
      .data(catalogBuilder(result))
      .build();
  }
}

export default UpdateProductTemplateController;
