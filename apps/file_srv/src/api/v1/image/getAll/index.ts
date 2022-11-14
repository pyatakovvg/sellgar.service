
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/images')
class ImageController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query);

    const db = super.plugin.get('db');
    const Image = db.model['Image'];

    const repository = db.repository(Image);
    const queryBuilder = repository
      .createQueryBuilder('image')
      .select(['image.uuid', 'image.name', 'image.size', 'image.mime', 'image.width', 'image.height'])
      .orderBy('image.createdAt', 'DESC');

    if (query?.['all']?.[0] !== 'true') {
      if ('folderUuid' in query) {
        queryBuilder.andWhere('image.folderUuid IN (:...uuid)', { uuid: query['folderUuid'] });
      }
      else {
        queryBuilder.andWhere('image.folderUuid IS NULL');
      }
    }

    if ('skip' in query) {
      queryBuilder.offset(Number(query['skip'][0]));
    }

    if ('take' in query) {
      queryBuilder.limit(Number(query['take'][0]));
    }

    const result = await queryBuilder.getManyAndCount();

    return new Result()
      .data(result[0])
      .meta({
        totalRows: result[1],
      })
      .build();
  }
}

export default ImageController;
