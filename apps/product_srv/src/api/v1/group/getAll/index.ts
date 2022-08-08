
import { Route, Result, Controller } from '@library/app';

import groupBuilder from './builders/group';


@Route('get', '/api/v1/groups')
class GetGroupController extends Controller {
  async send(): Promise<any> {
    const query = super.query;
    const where = {};
    const order = [];
    const include = [];

    const db = super.plugin.get('db');

    const Group = db.models['Group'];
    const Category = db.models['Category'];

    if ('code' in query) {
      where['code'] = query['code'];
    }

    if ('include' in query) {
      if ( !!~ query['include'].indexOf('category')) {
        order.push(['categories', 'name', 'asc']);
        include.push({
          model: Category,
          required: query['required'] ? !!~ query['required'].indexOf('category'): null,
          attributes: ['code', 'name', 'description'],
          as: 'categories',
        });
      }
    }

    const result = await Group.findAll({
      where: {
        ...where,
      },
      order: [
        ['name', 'asc'],
        ...order,
      ],
      attributes: ['code', 'icon', 'name', 'description'],
      include: [
        ...include,
      ],
    });

    return new Result(true)
      .data(result.map(item => groupBuilder(item.toJSON())))
      .build();
  }
}

export default GetGroupController;
