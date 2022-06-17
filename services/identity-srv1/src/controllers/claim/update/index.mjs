
import { BadRequestError } from '@package/errors';

import Ajv from 'ajv';

import Saga from "./saga.mjs";
import SagaParams from "./saga-params.mjs";

import claimScheme from '../../../_schemes/claim.json';
import claimBuilder from '../../../builders/claim.mjs';


export default () => async (ctx) => {
  const { uuid } = ctx['params'];
  const body = ctx['request']['body'];

  if ( ! uuid) {
    throw new BadRequestError({ code: '100.0.0', message: 'UUID is empty' });
  }

  const ajv = new Ajv();
  const validation = ajv.compile(claimScheme);

  if ( ! validation(body)) {
    throw new BadRequestError({ code: '100.0.0', message: validation['errors'][0]['message'] });
  }

  const sagaParams = new SagaParams();
  const saga = new Saga(ctx);

  const params = await saga.execute(sagaParams);

  ctx.body = {
    success: true,
    data: claimBuilder(params.getClaim()),
  };
};
