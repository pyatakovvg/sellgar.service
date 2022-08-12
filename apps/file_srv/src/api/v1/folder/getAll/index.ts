
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/folders/:uuid')
class ImageController extends Controller {
  async send(): Promise<any> {
    const params = super.params;
    const db = super.plugin.get('db');

    const where = {};
    const Image = db.models['Image'];
    const Folder = db.models['Folder'];

    if (params['uuid'] !== 'root') {
      where['parentUuid'] = params['uuid'];
    }
    else {
      where['parentUuid'] = null;
    }

    const result = await Folder.findAndCountAll({
      order: [
        ['name', 'asc'],
      ],
      group: [
        'Folder.uuid',
        'images.FolderImage.imageUuid',
        'images.FolderImage.folderUuid',
      ],
      where: {
        ...where,
      },
      attributes: ['uuid', 'name',
        [db.sequelize.fn('count', db.sequelize.col('images.FolderImage.imageUuid')), 'imagesCount'],
        [db.sequelize.fn('count', db.sequelize.col('folders.uuid')), 'foldersCount'],
      ],
      include: [{
        model: Folder,
        attributes: [],
        as: 'folders',
      }, {
        model: Image,
        through: 'FolderImage',
        attributes: [],
        as: 'images',
      }]
    });

    return new Result()
      .data(result['rows'].map((item) => {
        console.log(item.toJSON())
        return item.toJSON()
      }))
      .meta({
        total: result['count'],
      })
      .build();
  }
}

export default ImageController;
