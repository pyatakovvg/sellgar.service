
import { Route, Result, Controller } from '@library/app';


@Route('get', '/api/v1/.well-known')
class CheckController extends Controller {
  async send(): Promise<any> {

    return new Result(true)
      .data(process.env['JWT_SECRET'])
      .build();
  }
}

export default CheckController;
