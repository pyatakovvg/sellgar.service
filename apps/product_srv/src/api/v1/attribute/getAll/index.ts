
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/attributes')
class GetAttributesController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query);

    const db = super.plugin.get('db');
    const Attribute = db.model['Attribute'];

    const repository = db.repository(Attribute);
    const queryBuilder = repository.createQueryBuilder('attribute')
      .select(['attribute.uuid', 'attribute.code', 'attribute.name', 'attribute.description', 'attribute.isFiltered']);

    if ('uuid' in query) {
      queryBuilder
        .andWhere('attribute.uuid IN (:...uuid)', { uuid: query['uuid'] });
    }

    if ('include' in query) {
      if ( !!~ query['include'].indexOf('category')) {
        queryBuilder
          .leftJoin('attribute.category', 'category')
          .addSelect(['category.uuid', 'category.code', 'category.name', 'category.description']);

        if ('categoryCode' in query) {
          queryBuilder
            .andWhere('category.code IN (:...categoryCode)', { categoryCode: query['categoryCode'] });
        }
        else if ('categoryUuid' in query) {
          queryBuilder
            .andWhere('category.uuid IN (:...categoryUuid)', { categoryUuid: query['categoryUuid'] });
        }

        queryBuilder.addOrderBy('category.order', 'ASC');
      }
    }

    if ('unitUuid' in query) {
      queryBuilder
        .andWhere('unit.uuid IN (:...unitUuid)', { unitUuid: query['unitUuid'] });
    }

    const result = await queryBuilder
      .leftJoin('attribute.unit', 'unit')
      .addSelect(['unit.uuid', 'unit.name', 'unit.description'])
      .getManyAndCount();

    return new Result(true)
      .data(result[0])
      .meta({
        totalRows: result[1]
      })
      .build();
  }
}

export default GetAttributesController;
