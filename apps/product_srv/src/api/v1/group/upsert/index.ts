
import { Route, Result, Controller } from '@library/app';


@Route('post', '/api/v1/groups')
class UpsertGroupController extends Controller {
  async send(): Promise<any> {
    const body = super.body as Array<any>;

    const db = super.plugin.get('db');
    const Group = db.model['Group'];

    await db.manager.transaction(async (entityManager) => {
      const repository = entityManager.getRepository(Group);

      const groupModel = {
        code: body['code'],
        name: body['name'],
        description: body['description'],
      };
      if (body['uuid']) {
        groupModel['uuid'] = body['uuid'];
      }
      if (body['image']) {
        groupModel['images'] = [{ uuid: body['image']['uuid'] }];
      }

      await repository.save(groupModel, {});

      const result = await repository
        .createQueryBuilder('group')
        .orderBy('group.order', 'ASC')
        .getMany();

      const updatedGroups = result.map((group: any, index: number) => ({
        ...group,
        order: index,
      }));

      await repository.upsert(updatedGroups, ['uuid']);
    });

    return new Result()
      .data(null)
      .build();
  }
}

export default UpsertGroupController;
