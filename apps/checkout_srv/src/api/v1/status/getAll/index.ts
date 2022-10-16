
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/statuses')
class GetStatusController extends Controller {
  async send(): Promise<Result> {
    const db = super.plugin.get('db');
    const Status = db.model['CheckoutStatus'];

    const repository = db.manager.getRepository(Status);
    const queryBuilder = repository.createQueryBuilder('status')
      .select(['status.code', 'status.displayName', 'status.description'])
      .addOrderBy('status.displayName', 'ASC');

    const result = await queryBuilder.getMany();

    return new Result()
      .data(result)
      .build();
  }
}

export default GetStatusController;
