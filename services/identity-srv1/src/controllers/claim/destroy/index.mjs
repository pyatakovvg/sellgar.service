
import { BadRequestError } from '@package/errors';

import Saga from "./saga.mjs";
import SagaParams from "./saga-params.mjs";


export default () => async (ctx) => {
  const { uuid } = ctx['params'];

  if ( ! uuid) {
    throw new BadRequestError({ code: '100.0.0', message: 'UUID is empty' });
  }

  const sagaParams = new SagaParams();
  const saga = new Saga(ctx);

  await saga.execute(sagaParams);

  ctx.body = {
    success: true,
    data: null,
  };
};
