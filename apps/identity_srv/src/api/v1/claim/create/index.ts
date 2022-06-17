
import { Route, Result, Controller, BadRequestError } from '@library/app';

import Ajv from 'ajv';

import Saga from "./Saga";
import SagaParams from "./SagaParams";

import claimScheme from './_schemes/claim.json';


@Route('post', '/api/v1/claim')
class ClaimGetController extends Controller {
  async send(): Promise<any> {
    const body = super.body;

    const ajv = new Ajv();
    const validation = ajv.compile(claimScheme);

    if ( ! validation(body)) {
      throw new BadRequestError({ code: '100.1.0', message: validation['errors'][0]['message'] });
    }

    const saga = new Saga(this);
    const sagaParams = new SagaParams();

    const params = await saga.execute(sagaParams);

    return new Result(true)
      .data(params.result)
      .build();
  }
}
