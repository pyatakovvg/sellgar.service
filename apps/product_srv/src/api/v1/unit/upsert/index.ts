
import { Route, Result, Controller } from '@library/app';


@Route('post', '/api/v1/units')
class CreateBrandController extends Controller {
  async send(): Promise<any> {
    const body = super.body as Array<any>;

    const db = super.plugin.get('db');
    const Unit = db.model['Unit'];

    await db.manager.transaction(async (entityManager) => {
      const repository = entityManager.getRepository(Unit);

      const unitModel = {
        name: body['name'],
        description: body['description'],
      };
      if (body['uuid']) {
        unitModel['uuid'] = body['uuid'];
      }

      await repository.save(unitModel, {});

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
