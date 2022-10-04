
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/currencies')
class CheckController extends Controller {
  async send(): Promise<any> {
    const db = super.plugin.get('db');

    const Currency = db.model['Currency'];

    const repository = db.repository(Currency);
    const queryBuilder = repository.createQueryBuilder('currency');

    const result = await queryBuilder
      .select(['currency.code', 'currency.displayName'])
      .getMany();

    return new Result(true)
      .data(result)
      .build();
  }
}

export default CheckController;
