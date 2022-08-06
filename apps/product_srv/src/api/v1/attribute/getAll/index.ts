
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

    if ('categoryCode' in query) {
      where['categoryCode'] = query['categoryCode'];
    }

    if ('unitUuid' in query) {
      where['unitUuid'] = query['unitUuid'];
    }

    const result = await Attribute.findAll({
      where: {
        ...where,
      },
      order: [
        ['name', 'asc'],
      ],
      attributes: ['uuid', 'name', 'description', 'isFiltered'],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['code', 'name', 'description'],
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
