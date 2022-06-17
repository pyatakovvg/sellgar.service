
import { BadRequestError } from '@package/errors';
import { Route, Result, Controller } from '@library/app';

import Saga from "./Saga";
import SagaParams from "./SagaParams";


@Route('delete', '/api/v1/claim/:uuid')
class ClaimDestroyController extends Controller {
  async send() {
    const { uuid } = super.params;

    if ( ! uuid) {
      throw new BadRequestError({ code: '100.0.0', message: 'UUID is empty' });
    }

    const saga = new Saga(this);
    const sagaParams = new SagaParams();

    await saga.execute(sagaParams);

    return new Result(true)
      .data(null)
      .build();
  }
}

export default ClaimDestroyController;
