
import { BadRequestError } from '@package/errors';

import Ajv from 'ajv';

import Saga from "./saga.mjs";
import SagaParams from "./saga-params.mjs";

import permissionScheme from '../../../_schemes/permission.json';
import permissionBuilder from '../../../builders/permission.mjs';


export default () => async (ctx) => {
  const body = ctx['request']['body'];

  const ajv = new Ajv();
  const validation = ajv.compile(permissionScheme);

  if ( ! validation(body)) {
    throw new BadRequestError({ code: '10', message: validation['errors'][0]['message'] });
  }

  const sagaParams = new SagaParams();
  const saga = new Saga(ctx);

  const params = await saga.execute(sagaParams);

  ctx.body = {
    success: true,
    data: permissionBuilder(params.getResult()),
  };
};
