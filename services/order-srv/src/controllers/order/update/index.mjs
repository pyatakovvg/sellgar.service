
// import { BadRequestError } from "@package/errors";

// import Ajv from "ajv";

import Saga from './saga.mjs';
import SagaParams from './saga-params.mjs';

// import orderScheme from "../../../_schemes/order.json";


export default () => async (ctx) => {
  // const body = ctx['request']['body'];
  //
  // const ajv = new Ajv();
  // const validation = ajv.compile(orderScheme);
  //
  // if ( ! validation(body)) {
  //   console.log(validation.errors)
  //   throw new BadRequestError({ code: '9.9.9', message: 'Неверный формат запроса' });
  // }

  const sagaParams = new SagaParams();
  const saga = new Saga(ctx);

  const params = await saga.execute(sagaParams);

  ctx.body = {
    success: true,
    data: params.getFinishOrder(),
  };
};
