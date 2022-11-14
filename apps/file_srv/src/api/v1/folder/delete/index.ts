
import { Route, Result, Controller } from '@library/app';


@Route('delete', '/api/v1/folders/:uuid')
class DeleteFolderController extends Controller {
  async send(): Promise<any> {
    const params = super.params;
console.log(params)
    const db = super.plugin.get('db');
    // const rabbit = super.plugin.get('rabbit');

    const Folder = db.model['Folder'];

    const repository = db.repository(Folder);
    const queryBuilder = repository.createQueryBuilder();

    await queryBuilder
      .delete()
      .from(Folder)
      .where('uuid = :uuid', { uuid: params['uuid'] })
      .execute();

    // await rabbit.sendEvent(process.env['FILE_SRV_IMAGE_DELETE_EXCHANGE'], params['uuid']);

    return new Result()
      .data(params)
      .build();
  }
}

export default DeleteFolderController;
