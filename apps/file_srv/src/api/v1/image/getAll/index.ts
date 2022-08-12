
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/images')
class ImageController extends Controller {
  async send(): Promise<any> {
    const query = super.query;
    const db = super.plugin.get('db');

    const where = {};

    const Image = db.models['Image'];
    const Folder = db.models['Folder'];

    if ('folderUuid' in query) {
      if (query['folderUuid'] !== 'root') {
        where['uuid'] = query['folderUuid'];
      }
    }
    else {
      where['uuid'] = null;
    }

    const result = await Image.findAndCountAll({
      order: [
        ['createdAt', 'desc'],
      ],
      attributes: ['uuid', 'name'],
      include: [{
        model: Folder,
        where: {
          ...where,
        },
        required: true,
        through: 'FolderImage',
        attributes: [],
        as: 'folders',
      }]
    });

    return new Result()
      .data(result['rows'].map((item) => item.toJSON()))
      .meta({
        total: result['count'],
      })
      .build();
  }
}

export default ImageController;
