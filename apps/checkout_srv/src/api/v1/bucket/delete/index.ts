
import { Route, Result, Controller } from '@library/app';


@Route('delete', '/api/v1/buckets/:uuid')
class DeleteOrderController extends Controller {
  async send(): Promise<any> {
    const params = super.params;

    const db = super.plugin.get('db');
    const Bucket = db.model['Bucket'];

    const repository = db.manager.getRepository(Bucket);
    const queryBuilder = repository.createQueryBuilder()
      .delete()
      .from(Bucket)
      .where("uuid = :uuid", { uuid: params['uuid'] });

    await queryBuilder.execute();

    return new Result()
      .data(null)
      .build();
  }
}

export default DeleteOrderController;
