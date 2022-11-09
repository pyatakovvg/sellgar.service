
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/folders')
class ImageController extends Controller {
  async send(): Promise<any> {
    const query = super.query;
    const db = super.plugin.get('db');

    const where = {};
    const where2 = {};
    const Folder = db.models['Folder'];

    if (query['uuid']) {
      where['parentUuid'] = query['uuid'];
      where2['folderUuid'] = query['uuid'];
    }
    else {
      where['parentUuid'] = null;
    }

    const result = await Folder.findAndCountAll({
      order: [
        ['name', 'asc'],
      ],
      where: {
        ...where,
      },
      attributes: [
        'uuid',
        'name',
      ],
    });

    return new Result()
      .data(result['rows'].map((item) => {
        return item.toJSON()
      }))
      .meta({
        total: result['count'],
      })
      .build();
  }
}

export default ImageController;
