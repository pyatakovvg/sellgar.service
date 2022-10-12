
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';

import brandBuilder from './builders/brand';


@Route('get', '/api/v1/brands')
class GetBrandController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query);

    const db = super.plugin.get('db');
    const Brand = db.model['Brand'];


    const repository = db.repository(Brand);
    const queryBuilder = await repository.createQueryBuilder('brand')
      .select(['brand.uuid', 'brand.code', 'brand.name', 'brand.description']);

    if ('uuid' in query) {
      queryBuilder
        .andWhere('brand.uuid IN (:...uuid)', { uuid: query['uuid'] });
    }

    if ('code' in query) {
      queryBuilder
        .andWhere('brand.code IN (:...code)', { code: query['code'] });
    }

    queryBuilder
      .leftJoin('brand.images', 'image')
      .addSelect(['image.uuid', 'image.name'])

      .addOrderBy('brand.order', 'ASC');

    const result = await queryBuilder.getManyAndCount();

    return new Result(true)
      .data(result[0].map(brandBuilder))
      .meta({ totalRows: result[1] })
      .build();
  }
}

export default GetBrandController;
