
import { Route, Result, Controller } from '@library/app';

// import userBuilder from './builders/user';


// interface IBody {
//   login: string;
//   password: string;
// }


@Route('get', '/api/v1/categories')
class GetCategoriesController extends Controller {
  async send(): Promise<any> {
    const query = super.query;
    const where = {};

    const db = super.plugin.get('db');

    const Category = db.models['Category'];

    if ('uuid' in query) {
      where['uuid'] = query['uuid'];
    }

    const result = await Category.findAll({
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

export default GetCategoriesController;
