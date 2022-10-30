
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
    console.log(product)
    const catalogUpdated = await catalog.save({
      externalId: Date.now().toString(32),
      name: product['name'],
      description: product['description'],
      isUse: false,
      // images: product['images'].map((item: any) => {
      //   console.log(item)
      //   return {
      //     image: item['image'],
      //   };
      // }),
      groupUuid: product?.['group']?.['uuid'] ?? null,
      categoryUuid: product?.['category']?.['uuid'] ?? null,
      products: [],
      // attributes: product['attributes'].map((item: any, index: number) => {
      //   return {
      //     order: index,
      //     name: item['name'],
      //     values: item['values'].map((item: any, index: number) => ({
      //       order: index,
      //       value: item['value'],
      //       attribute: { uuid: item['attribute']['uuid'] },
      //     })),
      //   }
      // }),
    });

    const result = await catalog.getOne(catalogUpdated['uuid']);

    await rabbit.sendEvent(process.env['PRODUCT_SRV_PRODUCT_UPSERT_EXCHANGE'], result);

    return new Result()
      .data(null)
      // .data(catalogBuilder(result))
      .build();
  }
}

export default CopyProductTemplateController;
