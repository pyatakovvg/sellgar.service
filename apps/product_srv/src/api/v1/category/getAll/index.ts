
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';

import categoryBuilder from './builders/category';


@Route('get', '/api/v1/categories')
class GetCategoriesController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query) as any;

    const db = super.plugin.get('db');
    const Category = db.model['Category'];


    const repository = db.repository(Category);
    let queryBuilder = repository.createQueryBuilder('category')
      .select(['category.uuid', 'category.code', 'category.name', 'category.description', 'category.icon'])

    if ('uuid' in query) {
      queryBuilder.andWhere('category.uuid IN (:...uuid)', { uuid: query['uuid'] });
    }

    if ('code' in query) {
      queryBuilder.andWhere('category.code IN (:...code)', { code: query['code'] });
    }

    if ('groupUuid' in query) {
      queryBuilder
        .innerJoin('category.group', 'c_group')
        .andWhere('c_group.uuid IN (:...groupUuid)', { groupUuid: query['groupUuid'] });
    }

    if ('include' in query) {
      if ( !!~ query['include'].indexOf('group')) {
        queryBuilder
          .leftJoin('category.group', 'group')
          .addSelect(['group.uuid', 'group.code', 'group.name', 'group.description', 'group.icon'])

          .leftJoin('group.images', 'g_image')
          .addSelect(['g_image.uuid']);
      }
    }

    queryBuilder
      .leftJoin('category.images', 'c_image')
      .addSelect(['c_image.uuid'])

      .addOrderBy('category.order', 'ASC');


    const result = await queryBuilder.getManyAndCount();

    return new Result(true)
      .data(result[0].map(categoryBuilder))
      .meta({ totalRows: result[1] })
      .build();
  }
}

export default GetCategoriesController;
