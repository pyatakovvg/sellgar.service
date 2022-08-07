
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/products/brands')
class GetProductsController extends Controller {
  async send(): Promise<any> {
    const where = {};

    const data = super.query;
    const db = super.plugin.get('db');

    const Brand = db.models['Brand'];
    const Product = db.models['Product'];

    if ('groupCode' in data) {
      where['groupCode'] = data['groupCode'];
    }

    if ('categoryCode' in data) {
      where['categoryCode'] = data['categoryCode'];
    }

    const result = await Brand.findAll({
      distinct: true,
      group: [
        'Brand.code'
      ],
      order: [
        ['order', 'asc'],
      ],
      attributes: ['name', 'code', 'description', [db.sequelize.fn('COUNT', db.sequelize.col('products')), 'productsCount']],
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