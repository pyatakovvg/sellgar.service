
import { Route, Result, Controller } from '@library/app';


@Route('post', '/api/v1/categories')
class CreateCategoryController extends Controller {
  async send(): Promise<any> {
    const body = super.body as any;

    const db = super.plugin.get('db');
    const Category = db.model['Category'];

    await db.manager.transaction(async (entityManager) => {
      const repository = entityManager.getRepository(Category);

      const categoryModel = {
        code: body['code'],
        name: body['name'],
        description: body['description'],
      };
      if (body['uuid']) {
        categoryModel['uuid'] = body['uuid'];
      }
      if (body['image']) {
        categoryModel['images'] = [{ uuid: body['image']['uuid'] }];
      }
      if (body['group']) {
        categoryModel['group'] = { uuid: body['group']['uuid'] };
      }

      await repository.save(categoryModel, {});

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

export default CreateCategoryController;
