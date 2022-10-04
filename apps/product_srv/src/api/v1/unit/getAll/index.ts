
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/units')
class GetUnitController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query);

    const db = super.plugin.get('db');
    const Unit = db.model['Unit'];


    const repository = db.repository(Unit);
    let queryBuilder = repository
      .createQueryBuilder('unit')
      .select(['unit.uuid', 'unit.name', 'unit.description']);

    if ('uuid' in query) {
      queryBuilder
        .where('unit.uuid IN (:...uuid)', { uuid: query['uuid'] });
    }

    const result = await queryBuilder.getManyAndCount();

    return new Result(true)
      .data(result[0])
      .meta({ totalRows: result[1] })
      .build();
  }
}

export default GetUnitController;
