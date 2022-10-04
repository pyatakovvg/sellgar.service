
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';


@Route('delete', '/api/v1/attributes')
class CreateBrandController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query);

    const db = super.plugin.get('db');
    const Attribute = db.model['Attribute'];

    await db.manager.transaction(async (entityManager) => {
      const repository = entityManager.getRepository(Attribute);

      await repository
        .createQueryBuilder()
        .delete()
        .from(Attribute)
        .where('uuid IN (:...uuid)', { uuid: query['uuid']  })
        .execute();
    });

    return new Result()
      .data(null)
      .build();
  }
}

export default CreateBrandController;
