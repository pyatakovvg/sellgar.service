
import { Route, Result, Controller, BadRequestError } from '@library/app';

import Ajv from 'ajv';

import Saga from "./Saga";
import SagaParams from "./SagaParams";

import permissionScheme from './_schemes/permission.json';


@Route('post', '/api/v1/permissions')
class ClaimGetController extends Controller {
  async send(): Promise<any> {
    const body = super.body;

    const ajv = new Ajv();
    const validation = ajv.compile(permissionScheme);

    if ( ! validation(body)) {
      throw new BadRequestError({code: '10', message: validation['errors'][0]['message']});
    }

    const saga = new Saga(this);
    const sagaParams = new SagaParams();

    const params = await saga.execute(sagaParams);

    return new Result(true)
      .data(params.result)
      .build();
  }
}
