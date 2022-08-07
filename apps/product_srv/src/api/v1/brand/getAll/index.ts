
import { Route, Result, Controller } from '@library/app';

// import userBuilder from './builders/user';


// interface IBody {
//   login: string;
//   password: string;
// }


@Route('get', '/api/v1/brands')
class CheckController extends Controller {
  async send(): Promise<any> {
    const query = super.query;
    const where = {};

    const db = super.plugin.get('db');

    const Brand = db.models['Brand'];

    if ('code' in query) {
      where['code'] = query['code'];
    }

    const result = await Brand.findAll({
      where: {
        ...where,
      },
      order: [
        ['name', 'asc']
      ],
      attributes: ['code', 'name', 'description'],
    });

    return new Result(true)
      .data(result.map(item => item.toJSON()))
      .build();
  }
}

export default CheckController;
