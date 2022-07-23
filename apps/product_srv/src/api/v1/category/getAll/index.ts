
import { Route, Result, Controller } from '@library/app';

import categoryBuilder from './builders/category';


@Route('get', '/api/v1/categories')
class GetCategoriesController extends Controller {
  async send(): Promise<any> {
    const query = super.query;
    const where = {};
    const whereGroups = {};

    const db = super.plugin.get('db');

    const Group = db.models['Group'];
    const Category = db.models['Category'];

    if ('uuid' in query) {
      where['uuid'] = query['uuid'];
    }

    if ('groupUuid' in query) {
      where['groupUuid'] = query['groupUuid'];
    }

    if ('groupCode' in query) {
      whereGroups['code'] = query['groupCode'];
    }

    const result = await Category.findAll({
      where: {
        ...where,
      },
      order: [
        ['order', 'asc']
      ],
      attributes: ['uuid', 'code', 'name', 'description', [db.sequelize.literal('(SELECT COUNT(*) FROM "Products" WHERE "Products"."categoryUuid" = "Category"."uuid" and "Products"."isUse" = true)'), 'productsCount']],
      include: [{
        model: Group,
        where: {
          ...whereGroups,
        },
        attributes: ['uuid', 'code', 'name', 'description'],
        as: 'group',
      }]
    });

    return new Result(true)
      .data(result.map(item => categoryBuilder(item.toJSON())))
      .build();
  }
}

export default GetCategoriesController;
