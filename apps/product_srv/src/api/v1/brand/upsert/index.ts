
import { Route, Result, Controller } from '@library/app';


@Route('post', '/api/v1/brands')
class CreateBrandController extends Controller {
  async send(): Promise<any> {
    const body = super.body as Array<any>;

    const db = super.plugin.get('db');
    const Brand = db.model['Brand'];

    await db.manager.transaction(async (entityManager) => {
      const repository = entityManager.getRepository(Brand);

      const brandModel = {
        code: body['code'],
        name: body['name'],
        description: body['description'],
      };
      if (body['uuid']) {
        brandModel['uuid'] = body['uuid'];
      }
      if (body['image']) {
        brandModel['images'] = [{ uuid: body['image']['uuid'] }];
      }

      await repository.save(brandModel, {});

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
