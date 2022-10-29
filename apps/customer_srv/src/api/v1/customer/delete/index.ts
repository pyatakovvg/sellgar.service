
import { Route, Result, Controller } from '@library/app';


@Route('delete', '/api/v1/customers')
class DeleteOrderController extends Controller {
  async send(): Promise<any> {
    // const query = super.query;

    // const db = super.plugin.get('db');
    // const Customer = db.model['Customer'];


    return new Result()
      .data(null)
      .build();
  }
}

export default DeleteOrderController;
