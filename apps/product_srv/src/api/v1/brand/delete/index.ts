
import { queryNormalize } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';


@Route('delete', '/api/v1/brands')
class CreateBrandController extends Controller {
  async send(): Promise<any> {
    const query = queryNormalize(super.query);

    const db = super.plugin.get('db');
    const Brand = db.model['Brand'];

    await db.manager.transaction(async (entityManager) => {
      const repository = entityManager.getRepository(Brand);

      await repository
        .createQueryBuilder()
        .delete()
        .from(Brand)
        .where('uuid IN (:...uuid)', { uuid: query['uuid']  })
        .execute();

      const result = await repository
        .createQueryBuilder('brand')
        .orderBy('brand.order', 'ASC')
        .getMany();

      const updatedBrands = result.map((brand: any, index: number) => ({
        ...brand,
        order: index,
      }));

      await repository.upsert(updatedBrands, ['uuid']);
    });

    return new Result()
      .data(null)
      .build();
  }
}

export default CreateBrandController;
