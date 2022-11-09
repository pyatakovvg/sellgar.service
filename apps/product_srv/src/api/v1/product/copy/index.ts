
import { Route, Result, Controller } from '@library/app';

import CatalogModel from "../_model/Catalog";
import catalogBuilder from '../_builder/catalog';


@Route('get', '/api/v1/products/:uuid/copy')
class CopyProductTemplateController extends Controller {
  async send(): Promise<any> {
    const params = super.params;

    const db = super.plugin.get('db');
    const rabbit = super.plugin.get('rabbit');

    const catalog = new CatalogModel(db);

    const product = await catalog.getOne(params['uuid']);

    const data = {
      name: product['name'],
      description: product['description'],
      isUse: false,
      groupUuid: product?.['group']?.['uuid'] ?? null,
      categoryUuid: product?.['category']?.['uuid'] ?? null,
      images: product['images'].map((image) => ({
        uuid: image['image']['uuid'],
      })),
      attributes: product['attributes'].map((group) => ({
        name: group['name'],
        values: group['values'].map((attr) => ({
          value: attr['value'],
          attributeUuid: attr['attribute']['uuid'],
        })),
      })),
    };

    const catalogUpdated = await catalog.save(data);
    const result = await catalog.getOne(catalogUpdated['uuid']);

    await rabbit.sendEvent(process.env['PRODUCT_SRV_CATALOG_UPSERT_EXCHANGE'], result);

    return new Result()
      .data(catalogBuilder(result))
      .build();
  }
}

export default CopyProductTemplateController;
