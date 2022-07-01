
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/comments')
class CheckController extends Controller {
  async send(): Promise<any> {
    const where = {};
    const offset = {};
    const options = {};

    const data = super.query;
    const db = super.plugin.get('db');

    if ('productUuid' in data) {
      where['uuid'] = data['uuid'];
    }

    if ('limit' in data) {
      options['limit'] = Number(data['limit']);
    }

    if (('skip' in data) && ('take' in data)) {
      offset['offset'] = Number(data['skip']);
      offset['limit'] = Number(data['take']);
    }

    const Comment = db.models['Comment'];
    const CommentTheme = db.models['CommentTheme'];

    const result = await Comment.findAndCountAll({
      ...options,
      ...offset,
      distinct: true,
      where: { ...where },
      order: [
        ['createdAt', 'asc'],
      ],
      attributes: ['uuid', 'author', 'description', 'createdAt', 'updatedAt'],
      include: [
        {
          model: CommentTheme,
          required: true,
          attributes: ['code', 'displayName', 'description'],
          as: 'theme',
        },
      ],
    });

    return new Result()
      .data(result['rows'].map((item) => item.toJSON()))
      .meta({
        totalRows: result['count'],
      })
      .build();
  }
}

export default CheckController;
