
import { Route, Result, Controller } from '@library/app';

// import userBuilder from './builders/user';


// interface IBody {
//   login: string;
//   password: string;
// }


@Route('get', '/api/v1/groups')
class CheckController extends Controller {
  async send(): Promise<any> {
    const query = super.query;
    const where = {};

    const db = super.plugin.get('db');

    const Group = db.models['Group'];

    if ('uuid' in query) {
      where['uuid'] = query['uuid'];
    }

    if ('code' in query) {
      where['code'] = query['code'];
    }

    const result = await Group.findAll({
      where: {
        ...where,
      },
      order: [
        ['order', 'asc']
      ],
      attributes: ['uuid', 'code', 'name', 'description'],
    });

    return new Result(true)
      .data(result.map(item => item.toJSON()))
      .build();
  }
}

export default CheckController;
