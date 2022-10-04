
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';


@Route('delete', '/api/v1/categories')
class DeleteCategoryController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query);

    const db = super.plugin.get('db');
    const Category = db.model['Category'];

    await db.manager.transaction(async (entityManager) => {
      const repository = entityManager.getRepository(Category);

      await repository
        .createQueryBuilder()
        .delete()
        .from(Category)
        .where('uuid IN (:...uuid)', { uuid: query['uuid']  })
        .execute();

      const result = await repository
        .createQueryBuilder('category')
        .orderBy('category.order', 'ASC')
        .getMany();

      const updatedCategories = result.map((category: any, index: number) => ({
        ...category,
        order: index,
      }));

      await repository.upsert(updatedCategories, ['uuid']);
    });

    return new Result()
      .data(null)
      .build();
  }
}

export default DeleteCategoryController;
