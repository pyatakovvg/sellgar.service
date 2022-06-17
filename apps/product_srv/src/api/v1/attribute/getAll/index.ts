
import { Route, Result, Controller } from '@library/app';

// import userBuilder from './builders/user';


// interface IBody {
//   login: string;
//   password: string;
// }


@Route('get', '/api/v1/attributes')
class GetAttributesController extends Controller {
  async send(): Promise<any> {
    const query = super.query;
    const db = super.plugin.get('db');
    const where = {};

    const Unit = db.models['Unit'];
    const Category = db.models['Category'];
    const Attribute = db.models['Attribute'];

    if ('uuid' in query) {
      where['uuid'] = query['uuid'];
    }

    if ('categoryUuid' in query) {
      where['categoryUuid'] = query['categoryUuid'];
    }

    if ('unitUuid' in query) {
      where['unitUuid'] = query['unitUuid'];
    }

    const result = await Attribute.findAll({
      where: {
        ...where,
      },
      order: [
        ['order', 'asc']
      ],
      attributes: ['uuid', 'name', 'description'],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['uuid', 'name', 'description'],
        },
        {
          model: Unit,
          as: 'unit',
          attributes: ['uuid', 'name', 'description'],
        }
      ]
    });

    return new Result(true)
      .data(result.map(item => item.toJSON()))
      .build();
  }
}

export default GetAttributesController;
