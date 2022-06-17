
import { BadRequestError } from '@package/errors';

import Ajv from 'ajv';

import Saga from "./saga.mjs";
import SagaParams from "./saga-params.mjs";

import customerScheme from '../../../_schemes/customer.json';
import customerBuilder from '../../../builders/customer.mjs';


export default () => async (ctx) => {
  const body = ctx['request']['body'];

  const ajv = new Ajv();
  const validation = ajv.compile(customerScheme);

  if ( ! validation(body)) {
    throw new BadRequestError({ code: '10', message: validation['errors'][0]['message'] });
  }

  const sagaParams = new SagaParams();
  const saga = new Saga(ctx);

  const params = await saga.execute(sagaParams);

  ctx.body = {
    success: true,
    data: customerBuilder(params.getResult()),
  };
};
