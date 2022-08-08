
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/products/groups')
class GetProductsController extends Controller {
  async send(): Promise<any> {
    const db = super.plugin.get('db');

    const Group = db.models['Group'];
    const Product = db.models['Product'];
    const Category = db.models['Category'];


    const result = await Group.findAll({
      raw: true,
      distinct: true,
      subQuery: false,
      group: [
        'Group.code',
      ],
      order: [
        ['name', 'asc'],
      ],
      attributes: ['code', 'icon', 'imageUuid', 'name', 'description', [db.sequelize.fn('COUNT', db.sequelize.col('products')), 'productsCount']],
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

    const newResult = [...result];
    for (let index in newResult) {
      const group = newResult[index];

      newResult[index]['categories'] =  await Category.findAll({
        raw: true,
        group: [
          'Category.code',
        ],
        where: {
          groupCode: group['code'],
        },
        attributes: ['code', 'name', 'imageUuid', 'description', [db.sequelize.fn('COUNT', db.sequelize.col('products')), 'productsCount']],
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
    }

    return new Result()
      .data(newResult)
      .build();
  }
}

export default GetProductsController;
