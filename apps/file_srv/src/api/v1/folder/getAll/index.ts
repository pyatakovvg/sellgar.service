
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/folders')
class FoldersController extends Controller {
  async send(): Promise<any> {
    const query = super.query;
    const db = super.plugin.get('db');

    const Image = db.model['Image'];
    const Folder = db.model['Folder'];

    const repository = await db.manager.getTreeRepository(Folder);

    let result;
    if ('uuid' in query) {
      result = await repository.findDescendantsTree({ uuid: query.uuid }, {
        depth: 1,
      });
    }
    else {
      result = await repository.findTrees({
        depth: 1,
      });
    }

    const repositoryImage = db.manager.getRepository(Image);
    const queryBuilder = repositoryImage.createQueryBuilder('image')
      .select(['image.uuid', 'image.name', 'image.size', 'image.mime', 'image.width', 'image.height'])
      .orderBy('image.createdAt', 'DESC');

    if ('uuid' in result) {
      queryBuilder.innerJoin('image.folder', 'folder', 'folder.uuid = :folderUuid', { folderUuid: result['uuid'] });
    }
    else {
      queryBuilder.andWhere('image.folderUuid IS NULL');
    }

    const images = await queryBuilder.getMany();

    const parent = await repository.createAncestorsQueryBuilder("folder", "folderClosure", { uuid: query.uuid })
      .andWhere("folder.uuid != :uuid", { uuid: query.uuid })
      .getMany();

    const folder = await db.manager.getRepository(Folder)
      .createQueryBuilder('folder')
      .where('folder.uuid = :uuid', { uuid: query.uuid })
      .getOne();

    return new Result()
      .data({
        images,
        folder,
        parent,
        folders: result['children'] ? result['children'] : result,
      })
      .meta({
        total: 0,
      })
      .build();
  }
}

export default FoldersController;
