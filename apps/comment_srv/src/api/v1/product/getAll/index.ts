
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/products')
class CheckController extends Controller {
  async send(): Promise<any> {
    const where = {};
    const offset = {};
    const options = {};

    const data = super.query;
    const db = super.plugin.get('db');

    if ('uuid' in data) {
      where['uuid'] = data['uuid'];
    }

    if ('externalId' in data) {
      where['externalId'] = data['externalId'];
    }

    if ('isUse' in data) {
      where['isUse'] = data['isUse'];
    }

    if ('limit' in data) {
      options['limit'] = Number(data['limit']);
    }

    if (('skip' in data) && ('take' in data)) {
      offset['offset'] = Number(data['skip']);
      offset['limit'] = Number(data['take']);
    }

    const Product = db.models['Product'];
    const Comment = db.models['Comment'];

    const result = await Product.findAndCountAll({
      ...options,
      ...offset,
      nest: true,
      distinct: true,
      where: { ...where },
      group: [
        'Product.uuid',
        'comments.uuid',
      ],
      order: [
        ['createdAt', 'asc'],
        ['comments', 'createdAt', 'asc'],
      ],
      attributes: ['uuid', 'externalId', 'title', 'originalName', [db.sequelize.fn('count', db.sequelize.col('comments.uuid')), 'commentsCount']],
      include: [
        {
          model: Comment,
          require: false,
          attributes: [],
          as: 'comments',
        },
      ],
    });

    return new Result()
      .data(result['rows'].map((item) => item.toJSON()))
      .meta({
        totalRows: result['count'].length,
      })
      .build();
  }
}

export default CheckController;
