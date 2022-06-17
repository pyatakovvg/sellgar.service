
import { BadRequestError } from '@package/errors';

import Ajv from 'ajv';

import Saga from "./saga.mjs";
import SagaParams from "./saga-params.mjs";

import brandScheme from '../../../_schemes/brand.json';
import brandBuilder from '../../../_builders/brand.mjs';


export default () => async (ctx) => {
  const body = ctx['request']['body'];

  const ajv = new Ajv();
  const validation = ajv.compile(brandScheme);

  if ( ! validation(body)) {
    throw new BadRequestError({ code: '10', message: validation['errors'][0]['message'] });
  }

  const sagaParams = new SagaParams();
  const saga = new Saga(ctx);

  const params = await saga.execute(sagaParams);
  const result = params.getResult();

  ctx.body = {
    success: true,
    data: result.map((item) => brandBuilder(item)),
  };
};
