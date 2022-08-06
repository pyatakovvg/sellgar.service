
import { Route, Result, Controller } from '@library/app';

import groupBuilder from './builders/group';


// interface IBody {
//   login: string;
//   password: string;
// }


@Route('get', '/api/v1/groups')
class CheckController extends Controller {
  async send(): Promise<any> {
    const query = super.query;
    const where = {};
    const include = [];

    const db = super.plugin.get('db');

    const Group = db.models['Group'];
    const Category = db.models['Category'];

    if ('code' in query) {
      where['code'] = query['code'];
    }

    if ('include' in query) {
      if ( !!~ query['include'].indexOf('category')) {
        include.push({
          model: Category,
          required: query['required'] ? !!~ query['required'].indexOf('category'): null,
          attributes: ['code', 'name', 'description',
            // [db.sequelize.literal('(SELECT COUNT(*) FROM "Products" WHERE "Products"."categoryCode" = "categories"."code" and "Products"."isUse" = true)'), 'productsCount'],
          ],
          as: 'categories',
        });
      }
    }

    const result = await Group.findAll({
      where: {
        ...where,
      },
      order: [
        ['order', 'asc']
      ],
      attributes: ['code', 'code', 'name', 'description',
        //[db.sequelize.literal('(SELECT COUNT(*) FROM "Products" WHERE "Products"."groupCode" = "Group"."code" and "Products"."isUse" = true)'), 'productsCount']
      ],
      include: [
        ...include,
      ],
    });

    return new Result(true)
      .data(result.map(item => groupBuilder(item.toJSON())))
      .build();
  }
}

export default CheckController;
