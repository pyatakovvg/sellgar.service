
import { BadRequestError } from '@package/errors';

import Ajv from 'ajv';

import Saga from "./saga.mjs";
import SagaParams from "./saga-params.mjs";

import productScheme from '../../../_schemes/product.json';
import productBuilder from '../../../_builders/product.mjs';


export default () => async (ctx) => {
  const body = ctx['request']['body'];

  const ajv = new Ajv();
  const validation = ajv.compile(productScheme);

  if ( ! validation(body)) {
    throw new BadRequestError({ code: '20', message: validation.errors['0']['message'] });
  }

  const sagaParams = new SagaParams();
  const saga = new Saga(ctx);

  const params = await saga.execute(sagaParams);

  ctx.body = {
    success: true,
    data: productBuilder(params.getResult()),
  };
};
