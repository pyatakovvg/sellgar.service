
import { Route, Result, Controller } from '@library/app';

import categoryBuilder from './builders/category';


@Route('get', '/api/v1/categories')
class GetCategoriesController extends Controller {
  async send(): Promise<any> {
    const query = super.query;
    const where = {};

    const db = super.plugin.get('db');

    const Group = db.models['Group'];
    const Category = db.models['Category'];

    if ('code' in query) {
      where['code'] = query['code'];
    }

    if ('groupCode' in query) {
      where['groupCode'] = query['groupCode'];
    }

    const result = await Category.findAll({
      where: {
        ...where,
      },
      order: [
        ['order', 'asc']
      ],
      attributes: ['code', 'name', 'description'],//, [db.sequelize.literal('(SELECT COUNT(*) FROM "Products" WHERE "Products"."categoryCode" = "Category"."code" and "Products"."isUse" = true)'), 'productsCount']],
      include: [{
        model: Group,
        attributes: ['code', 'name', 'description'],
        as: 'group',
      }]
    });

    return new Result(true)
      .data(result.map(item => categoryBuilder(item.toJSON())))
      .build();
  }
}

export default GetCategoriesController;
