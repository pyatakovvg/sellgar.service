
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';


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
      .leftJoin('category.image', 'c_image')
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
      .leftJoin('group.image', 'g_image')
      .addSelect(['g_image.uuid'])

      .addOrderBy('group.order', 'ASC');

    queryBuilder
      .innerJoin('category.products', 'products');

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
      .loadRelationCountAndMap('category.products', 'category.products', 'count', (qb) => {
        if ('groupCode' in query) {
          qb.innerJoin('count.group', 'group').andWhere('group.code IN (:...groupCode)', { groupCode: query['groupCode'] });
        }
        if ('categoryCode' in query) {
          qb.innerJoin('count.category', 'category').andWhere('category.code IN (:...categoryCode)', { categoryCode: query['categoryCode'] });
        }
        return qb;
      })

      .addOrderBy('category.order', 'ASC');


    const result = await queryBuilder.getManyAndCount();

    return new Result(true)
      .data(result[0])
      .build();
  }
}

export default GetProductCategoryController;
