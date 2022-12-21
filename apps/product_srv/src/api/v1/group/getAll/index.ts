
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';

import groupBuilder from './builders/group';


interface IQuery {
  uuid?: Array<string>;
  code?: Array<string>;
  include?: Array<string>;
}


@Route('get', '/api/v1/groups')
class GetGroupController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query) as IQuery;

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

    if ('include' in query) {
      if ( !!~ query['include'].indexOf('categories')) {
        queryBuilder
          .leftJoin("group.categories", "categories")
          .addSelect(['categories.uuid', 'categories.code', 'categories.name', 'categories.description', 'group.icon'])

            .leftJoin('categories.images', 'c_image')
            .addSelect(['c_image.uuid', 'c_image.name'])

          .loadRelationCountAndMap('categories.products', 'categories.products')

          .addOrderBy('categories.order', 'ASC');
      }
    }

    queryBuilder
      .leftJoin('group.images', 'g_image')
      .addSelect(['g_image.uuid', 'g_image.name'])

    const result = await queryBuilder.getManyAndCount();

    return new Result(true)
      .data(result[0].map(groupBuilder))
      .meta({
        totalRows: result[1],
      })
      .build();
  }
}

export default GetGroupController;
