
import { Route, Result, Controller } from '@library/app';

import categoryBuilder from './builders/category';


@Route('get', '/api/v1/categories')
class GetCategoriesController extends Controller {
  async send(): Promise<any> {
    const query = super.query;
    const where = {};

    const db = super.plugin.get('db');

    const Category = db.models['Category'];
    const Group = db.models['Group'];

    if ('uuid' in query) {
      where['uuid'] = query['uuid'];
    }

    if ('groupUUid' in query) {
      where['groupUuid'] = query['groupUuid'];
    }

    const result = await Category.findAll({
      where: {
        ...where,
      },
      order: [
        ['order', 'asc']
      ],
      attributes: ['uuid', 'code', 'name', 'description'],
      include: [{
        model: Group,
        attributes: ['uuid', 'code', 'name', 'description'],
        as: 'groups',
      }]
    });

    return new Result(true)
      .data(result.map(item => categoryBuilder(item.toJSON())))
      .build();
  }
}

export default GetCategoriesController;
