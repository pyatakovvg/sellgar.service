
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/products/categories')
class GetProductsController extends Controller {
  async send(): Promise<any> {
    const where = {};

    const query = super.query;
    const db = super.plugin.get('db');

    const Product = db.models['Product'];
    const Category = db.models['Category'];

    if ('groupCode' in query) {
      where['groupCode'] = query['groupCode'];
    }

    const result = await Category.findAll({
      distinct: true,
      group: [
        'Category.code',
      ],
      order: [
        ['name', 'asc'],
      ],
      where: {
        ...where,
      },
      attributes: ['code', 'imageUuid', 'name', 'description', [db.sequelize.fn('COUNT', db.sequelize.col('products')), 'productsCount']],
      include: [
        {
          model: Product,
          where: { isUse: true },
          required: true,
          attributes: [],
          as: 'products',
        },
      ],
    });

    return new Result()
      .data(result.map((item) => item.toJSON()))
      .build();
  }
}

export default GetProductsController;
