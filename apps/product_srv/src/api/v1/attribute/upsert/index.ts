
import { Route, Result, Controller } from '@library/app';


@Route('post', '/api/v1/attributes')
class CreateBrandController extends Controller {
  async send(): Promise<any> {
    const body = super.body as Array<any>;

    const db = super.plugin.get('db');
    const Attribute = db.model['Attribute'];

    await db.manager.transaction(async (entityManager) => {
      const repository = entityManager.getRepository(Attribute);

      const attrModel = {
        code: body['code'],
        name: body['name'],
        description: body['description'],
        isFiltered: body['isFiltered'],
      };
      if (body['uuid']) {
        attrModel['uuid'] = body['uuid'];
      }
      if (body['unit']) {
        attrModel['unit'] = { uuid: body['unit']['uuid'] };
      }

      await repository.save(attrModel, {});
    });

    return new Result()
      .data(null)
      .build();
  }
}

export default CreateBrandController;
