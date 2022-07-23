
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/products/brands')
class GetProductsController extends Controller {
  async send(): Promise<any> {
    const where = {};

    const data = super.query;
    const db = super.plugin.get('db');

    const Group = db.models['Group'];
    const Brand = db.models['Brand'];
    const Product = db.models['Product'];
    const Category = db.models['Category'];

    if ('groupCode' in data) {
      const group = await Group.findOne({ row: true, where: { code: data['groupCode'] }});
      where['groupUuid'] = group['uuid'];
    }

    if ('categoryCode' in data) {
      const category = await Category.findOne({ row: true, where: { code: data['categoryCode'] }});
      where['categoryUuid'] = category['uuid'];
    }

    const result = await Brand.findAll({
      distinct: true,
      group: [
        'Brand.uuid'
      ],
      order: [
        ['order', 'asc'],
      ],
      attributes: ['uuid', 'name', 'code', 'description', [db.sequelize.fn('COUNT', db.sequelize.col('products')), 'productsCount']],
      include: [
        {
          model: Product,
          where: { ...where, isUse: true },
          required: true,
          attributes: [],
          as: 'products',
        }
      ],
    });

    return new Result()
      .data(result.map((item) => item.toJSON()))
      .build();
  }
}

export default GetProductsController;
