
import Saga from "./saga.mjs";
import SagaParams from "./saga-params.mjs";

import categoryBuilder from '../../../_builders/category.mjs';


export default () => async (ctx) => {
  const sagaParams = new SagaParams();
  const saga = new Saga(ctx);

  const params = await saga.execute(sagaParams);
  const result = params.getResult();

  ctx.body = {
    success: true,
    data: result.map((theme) => categoryBuilder(theme)),
  };
};
