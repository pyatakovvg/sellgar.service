
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';

import categoryBuilder from './builders/category';
import product from "../_builder/product";


@Route('get', '/api/v1/products/categories')
class GetProductCategoryController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query);

    const db = super.plugin.get('db');
    const Category = db.model['Category'];


    const repository = db.repository(Category);
    let queryBuilder = repository.createQueryBuilder('category')
      .select(['category.uuid', 'category.code', 'category.name', 'category.description', 'category.icon'])

    queryBuilder
      .leftJoin('category.images', 'c_image')
      .addSelect(['c_image.uuid']);

    if ('uuid' in query) {
      queryBuilder.andWhere('category.uuid IN (:...uuid)', { uuid: query['uuid'] });
    }

    if ('code' in query) {
      queryBuilder.andWhere('category.code IN (:...code)', { code: query['code'] });
    }

    queryBuilder
      .leftJoin('category.group', 'group')
      .addSelect(['group.uuid', 'group.code', 'group.name', 'group.description', 'group.icon'])

    if ('groupUuid' in query) {
      queryBuilder.andWhere('group.uuid IN (:...groupUuid)', { groupUuid: query['groupUuid'] });
    }

    queryBuilder
      .leftJoin('group.images', 'g_image')
      .addSelect(['g_image.uuid'])

      .addOrderBy('group.order', 'ASC');

    queryBuilder
      .innerJoin('category.catalogs', 'catalog', 'catalog.isUse is true')
      .innerJoin('catalog.product', 'product', 'product.count > 0 AND product.reserve < product.count');

    if ('groupCode' in query) {
      queryBuilder
        .innerJoin('catalog.group', 'group')
        .andWhere('group.code IN (:...groupCode)', { groupCode: query['groupCode'] });
    }

    if ('categoryCode' in query) {
      queryBuilder
        .innerJoin('catalog.category', 'category')
        .andWhere('category.code IN (:...categoryCode)', { categoryCode: query['categoryCode'] });
    }

    queryBuilder
      .loadRelationCountAndMap('category.products', 'category.catalogs', 'catalog', (qb) => {
        if ('groupCode' in query) {
          qb.innerJoin('catalog.group', 'group').andWhere('group.code IN (:...groupCode)', { groupCode: query['groupCode'] });
        }
        if ('categoryCode' in query) {
          qb.innerJoin('catalog.category', 'category').andWhere('category.code IN (:...categoryCode)', { categoryCode: query['categoryCode'] });
        }
        return qb;
      })

      .addOrderBy('category.order', 'ASC');


    const result = await queryBuilder.getMany();

    return new Result(true)
      .data(result.map(categoryBuilder))
      .build();
  }
}

export default GetProductCategoryController;
