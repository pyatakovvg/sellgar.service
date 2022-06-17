
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/currencies')
class CheckController extends Controller {
  async send(): Promise<any> {
    const where = {};

    const db = super.plugin.get('db');

    const Currency = db.models['Currency'];

    const result = await Currency.findAll({
      where,
    });

    return new Result(true)
      .data(result.map(item => item.toJSON()))
      .build();
  }
}

export default CheckController;
