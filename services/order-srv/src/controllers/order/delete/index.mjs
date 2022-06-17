
import Saga from './saga.mjs';
import SagaParams from './saga-params.mjs';


export default () => async (ctx) => {
  const sagaParams = new SagaParams();
  const saga = new Saga(ctx);

  const params = await saga.execute(sagaParams);

  ctx.body = {
    success: true,
    data: params.getOrder(),
  };
};
