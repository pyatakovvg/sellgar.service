
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';

import groupBuilder from './builders/group';


@Route('get', '/api/v1/products/groups')
class GetProductGroupController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query);

    const db = super.plugin.get('db');
    const Group = db.model['Group'];


    const repository = db.repository(Group);
    let queryBuilder = repository.createQueryBuilder('group')
      .select(['group.uuid', 'group.code', 'group.name', 'group.description', 'group.icon'])
      .addOrderBy('group.order', 'ASC');

    if ('uuid' in query) {
      queryBuilder.andWhere('group.uuid IN (:...uuid)', { uuid: query['uuid'] })
    }

    if ('code' in query) {
      queryBuilder.andWhere('group.code IN (:...code)', { code: query['code'] })
    }

    queryBuilder
      .leftJoin('group.images', 'g_image')
      .addSelect(['g_image.uuid'])

      .innerJoin('group.products', 'g_products', 'g_products.isUse = true')

      .loadRelationCountAndMap('group.products', 'group.products', 'products', (qb) => {
        qb.andWhere('products.isUse = true');
        return qb;
      });


    queryBuilder
      .leftJoin('group.categories', 'categories')
      .addSelect(['categories.uuid', 'categories.code', 'categories.name', 'categories.description', 'group.icon'])

      .leftJoin('categories.images', 'c_image')
      .addSelect(['c_image.uuid'])

      .innerJoin('categories.products', 'c_products', 'c_products.isUse = true')

      .loadRelationCountAndMap('categories.products', 'categories.products', 'products', (qb) => {
        qb.andWhere('products.isUse = true');
        return qb;
      })

      .addOrderBy('categories.order', 'ASC');


    const result = await queryBuilder.getMany();
    
    return new Result(true)
      .data(result.map(groupBuilder))
      .build();
  }
}

export default GetProductGroupController;
