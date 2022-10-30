
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/products/attributes')
class GetAttributesController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query);

    const db = super.plugin.get('db');
    const Attribute = db.model['Attribute'];

    const repository = db.repository(Attribute);
    const queryRequest = repository.createQueryBuilder('attributes')
      .select(['attributes.uuid', 'attributes.code', 'attributes.name', 'attributes.description'])
      .where('attributes.isFiltered IS true', { status: true });

    queryRequest
      .leftJoin('attributes.unit', 'unit')
      .addSelect(['unit.uuid', 'unit.name'])

      .innerJoin('attributes.values', 'values')
      .addSelect(['values.uuid', 'values.value'])

      .innerJoin('values.group', 'group')
      .innerJoin('group.catalog', 'catalog')

    if ('groupCode' in query) {
      queryRequest
        .innerJoin('catalog.group', 'p_group', 'p_group.code IN (:...groupCode)', { groupCode: query['groupCode'] });
    }

    if ('categoryCode' in query) {
      queryRequest
        .innerJoin('catalog.category', 'p_category', 'p_category.code IN (:...categoryCode)', { categoryCode: query['categoryCode'] })
    }

    if ('brandCode' in query) {
      queryRequest
        .innerJoin('catalog.product', 'product')
        .innerJoin('product.brand', 'brand', 'brand.code IN (:...brandCode)', { brandCode: query['brandCode'] })
    }

    queryRequest
      .addOrderBy('attributes.name', 'ASC');

    const result = await queryRequest.getMany();

    const finalResult = result.reduce((accum, attr) => {
      accum.push({
        code: attr['code'],
        name: attr['name'],
        values: [...new Set(attr['values'].map((i) => i['value']))]
          .map((value) => ({
            value: value,
            unit: attr['unit'],
          }))
          .sort((left: any, right: any) => {
            if (left['value'] > right['value']) {
              return 1;
            }
            if (left['value'] < right['value']) {
              return -1;
            }
            return 0;
          }),
      });
      return accum;
    }, []);

    return new Result()
      .data(finalResult)
      .build();
  }
}

export default GetAttributesController;
