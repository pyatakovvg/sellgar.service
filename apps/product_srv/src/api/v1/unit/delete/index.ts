
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';


@Route('delete', '/api/v1/units')
class CreateBrandController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query);

    const db = super.plugin.get('db');
    const Unit = db.model['Unit'];

    await db.manager.transaction(async (entityManager) => {
      const repository = entityManager.getRepository(Unit);

      await repository
        .createQueryBuilder()
        .delete()
        .from(Unit)
        .where('uuid IN (:...uuid)', { uuid: query['uuid']  })
        .execute();

      const result = await repository
        .createQueryBuilder('unit')
        .orderBy('unit.order', 'ASC')
        .getMany();

      const updatedUnits = result.map((unit: any, index: number) => ({
        ...unit,
        order: index,
      }));

      await repository.upsert(updatedUnits, ['uuid']);
    });

    return new Result()
      .data(null)
      .build();
  }
}

export default CreateBrandController;
