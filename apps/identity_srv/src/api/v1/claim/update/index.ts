
import { Route, Result, Controller, BadRequestError } from '@library/app';

import Ajv from 'ajv';

import Saga from "./Saga";
import SagaParams from "./SagaParams";

import claimScheme from './_schemes/claim.json';


@Route('put', '/api/v1/claim/:uuid')
class ClaimUpdateController extends Controller {
  async send(): Promise<any> {
    const body = super.body;
    const { uuid } = super.params;

    if ( ! uuid) {
      throw new BadRequestError({ code: '100.0.0', message: 'UUID is empty' });
    }

    const ajv = new Ajv();
    const validation = ajv.compile(claimScheme);

    if ( ! validation(body)) {
      throw new BadRequestError({ code: '100.0.0', message: validation['errors'][0]['message'] });
    }

    const saga = new Saga(this);
    const sagaParams = new SagaParams();

    const params = await saga.execute(sagaParams);

    return new Result(true)
      .data(params.result)
      .build();
  }
}

export default ClaimUpdateController;
