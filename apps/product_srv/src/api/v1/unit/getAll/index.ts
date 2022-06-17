
import { Route, Result, Controller } from '@library/app';

// import userBuilder from './builders/user';


// interface IBody {
//   login: string;
//   password: string;
// }


@Route('get', '/api/v1/units')
class CheckController extends Controller {
  async send(): Promise<any> {
    const query = super.query;
    const where = {};

    const db = super.plugin.get('db');

    const Unit = db.models['Unit'];

    if ('uuid' in query) {
      where['uuid'] = query['uuid'];
    }

    const result = await Unit.findAll({
      where,
    });

    return new Result(true)
      .data(result.map(item => item.toJSON()))
      .build();
  }
}

export default CheckController;
