
import { Route, Result, Controller } from '@library/app';


@Route('post', '/api/v1/folders')
class CreateFolderController extends Controller {
  async send(): Promise<any> {
    const body = super.body;
    const db = super.plugin.get('db');

    const Folder = db.model['Folder'];

    const repository = db.manager.getTreeRepository(Folder);

    const folder = new Folder();
    folder.uuid = body?.uuid;
    folder.name = body.name;

    if ('parentUuid' in body) {
      folder.parent = { uuid: body.parentUuid };
    }

    const result = await repository.save(folder);

    return new Result()
      .data(result)
      .build();
  }
}

export default CreateFolderController;
