
import { BadRequestError } from '@package/errors';

import Ajv from 'ajv';

import Saga from "./saga.mjs";
import SagaParams from "./saga-params.mjs";

import userScheme from '../../../_schemes/user.json';
import userBuilder from '../../../builders/user.mjs';


export default () => async (ctx) => {
  const body = ctx['request']['body'];

  const ajv = new Ajv();
  const validation = ajv.compile(userScheme);

  if ( ! validation(body)) {
    throw new BadRequestError({ code: '10', message: validation['errors'][0]['message'] });
  }

  const sagaParams = new SagaParams();
  const saga = new Saga(ctx);

  const params = await saga.execute(sagaParams);

  ctx.body = {
    success: true,
    data: userBuilder(params.getResult()),
  };
};
