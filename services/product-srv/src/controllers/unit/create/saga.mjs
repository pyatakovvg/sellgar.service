
import { NetworkError } from '@package/errors';

import logger from '@package/logger';

import Sagas from 'node-sagas';

import getAllUnits from '../../../actions/unit/getAll';
import createUnits from '../../../actions/unit/create';
import destroyUnits from '../../../actions/unit/destroy';


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
    const body = this.ctx['request']['body'];

    return sagaBuilder
      .step('Create units')
      .invoke(async () => {
        logger.info('create units');

        await destroyUnits();
        await createUnits(body);
      })
      .withCompensation(async () => {
        logger.info('remove units');

        await destroyUnits();
      })

      .step('Get result themes')
      .invoke(async (params) => {
        logger.info('get result units');

        const result = await getAllUnits();
        params.setResult(result);
      })

      .build();
  }
}
