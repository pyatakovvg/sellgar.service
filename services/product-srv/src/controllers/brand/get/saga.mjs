
import logger from '@package/logger';
import { NetworkError } from '@package/errors';

import Sagas from 'node-sagas';

import getAllBrands from '../../../actions/brand/getAll';


export default class Saga {
  ctx = null;

  constructor(ctx) {
    this.ctx = ctx;
  }

  async execute(params) {
    const saga = await this.getSagaDefinition(this.ctx);
    try {
      return await saga.execute(params);
    }
    catch (e) {
      console.log(e)
      if (e instanceof Sagas.SagaExecutionFailed) {
        throw new NetworkError({ code: '2.0.0', message: e['message'] });
      }
      if (e instanceof Sagas.SagaCompensationFailed) {
        throw new NetworkError({ code: '2.0.1', message: e['message'] });
      }
    }
  }

  async getSagaDefinition() {
    const sagaBuilder = new Sagas.SagaBuilder();

    return sagaBuilder
      .step('Get result brands')
      .invoke(async (params) => {
        logger.info('get result brands');

        const result = await getAllBrands();
        params.setResult(result);
      })

      .build();
  }
}
