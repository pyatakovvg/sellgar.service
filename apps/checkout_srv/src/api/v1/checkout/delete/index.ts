
import { Route, Result, Controller } from '@library/app';

import Saga from "./saga";
import SagaParams from "./saga-params";


@Route('delete', '/api/v1/checkouts/:uuid')
class UpdateOrderController extends Controller {
  async send(): Promise<any> {
    // const ajv = new Ajv();
    // const validation = ajv.compile(unitScheme);
    //
    // if (!validation(body)) {
    //   throw new BadRequestError({code: '10', message: validation['errors'][0]['message']});
    // }

    const sagaParams = new SagaParams();
    const saga = new Saga(this);

    await saga.execute(sagaParams);

    return new Result()
      .data(null)
      .build();
  }
}

export default UpdateOrderController;
