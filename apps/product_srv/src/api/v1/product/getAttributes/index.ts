
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
      .where('attributes.isFiltered = :status', { status: true })

      if ('categoryCode' in query) {
        queryRequest
          .innerJoin('attributes.category', 'a_category')
          .andWhere('a_category.code IN (:...a_categoryCode)', { a_categoryCode: query['categoryCode'] });
      }

    queryRequest
      .leftJoin('attributes.unit', 'unit')
      .addSelect(['unit.uuid', 'unit.name'])

      .leftJoin('attributes.values', 'values')
      .addSelect(['values.uuid', 'values.value'])

        .innerJoin('values.group', 'group')
          .innerJoin('group.products', 'product')

          if ('categoryCode' in query) {
            queryRequest
              .innerJoin('product.category', 'p_category')
              .andWhere('p_category.code IN (:...p_categoryCode)', { p_categoryCode: query['categoryCode'] });
          }

          if ('groupCode' in query) {
            queryRequest
              .innerJoin('product.group', 'p_group')
              .andWhere('p_group.code IN (:...p_groupCode)', { p_groupCode: query['groupCode'] });
          }

          if ('brandCode' in query) {
            queryRequest
              .innerJoin('product.brand', 'p_brand')
              .andWhere('p_brand.code IN (:...p_brandCode)', { p_brandCode: query['brandCode'] });
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
