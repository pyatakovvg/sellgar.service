
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';


@Route('delete', '/api/v1/groups')
class DeleteGroupController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query);

    const db = super.plugin.get('db');
    const Group = db.model['Group'];

    await db.manager.transaction(async (entityManager) => {
      const repository = entityManager.getRepository(Group);

      await repository
        .createQueryBuilder()
        .delete()
        .from(Group)
        .where('uuid IN (:...uuid)', { uuid: query['uuid']  })
        .execute();

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

export default DeleteGroupController;
