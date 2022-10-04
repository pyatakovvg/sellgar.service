
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';


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
      .leftJoin('group.image', 'g_image')
      .addSelect(['g_image.uuid'])

      .innerJoin('group.products', 'g_products')

      .loadRelationCountAndMap('group.products', 'group.products');


    queryBuilder
      .leftJoin('group.categories', 'categories')
      .addSelect(['categories.uuid', 'categories.code', 'categories.name', 'categories.description', 'group.icon'])

      .leftJoin('categories.image', 'c_image')
      .addSelect(['c_image.uuid'])

      .innerJoin('categories.products', 'c_products')

      .loadRelationCountAndMap('categories.products', 'categories.products')

      .addOrderBy('categories.order', 'ASC');


    const result = await queryBuilder.getMany();

    return new Result(true)
      .data(result)
      .build();
  }
}

export default GetProductGroupController;
