
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';

import brandBuilder from './builders/brand';


@Route('get', '/api/v1/products/brands')
class GetProductBrandController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query);

    const db = super.plugin.get('db');
    const Brand = db.model['Brand'];


    const repository = db.repository(Brand);
    const queryBuilder = await repository.createQueryBuilder('brand')
      .select(['brand.uuid', 'brand.code', 'brand.name', 'brand.description']);

    if ('uuid' in query) {
      queryBuilder.andWhere('brand.uuid IN (:...b_uuid)', { b_uuid: query['uuid'] });
    }

    if ('code' in query) {
      queryBuilder.andWhere('brand.code IN (:...b_code)', { b_code: query['code'] });
    }

    queryBuilder
      .innerJoin('brand.products', 'products', 'products.isUse = true');

    if ('groupCode' in query) {
      queryBuilder
        .innerJoin('products.group', 'group')
        .andWhere('group.code IN (:...groupCode)', { groupCode: query['groupCode'] });
    }

    if ('categoryCode' in query) {
      queryBuilder
        .innerJoin('products.category', 'category')
        .andWhere('category.code IN (:...categoryCode)', { categoryCode: query['categoryCode'] });
    }

    queryBuilder
      .loadRelationCountAndMap('brand.products', 'brand.products', 'products', (qb) => {
        if ('groupCode' in query) {
          qb
            .innerJoin('products.group', 'group')
            .andWhere('group.code IN (:...p_groupCode)', { p_groupCode: query['groupCode'] });
        }
        if ('categoryCode' in query) {
          qb
            .innerJoin('products.category', 'category')
            .andWhere('category.code IN (:...p_categoryCode)', { p_categoryCode: query['categoryCode'] });
        }
        qb.andWhere('products.isUse = true');
        return qb;
      })

      .addOrderBy('brand.order', 'ASC');

    const result = await queryBuilder.getMany();

    return new Result(true)
      .data(result.map(brandBuilder))
      .build();
  }
}

export default GetProductBrandController;
