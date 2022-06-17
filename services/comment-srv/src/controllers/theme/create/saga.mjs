
import { NetworkError } from '@package/errors';

import logger from '@package/logger';

import Sagas from 'node-sagas';

import getThemes from '../../../actions/theme/get';
import createThemes from '../../../actions/theme/create';
import destroyThemes from '../../../actions/theme/destroy';


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
      .step('Create themes')
      .invoke(async () => {
        logger.info('create themes');

        await destroyThemes();
        await createThemes(body);
      })
      .withCompensation(async () => {
        logger.info('remove themes');

        await destroyThemes();
      })

      .step('Get result themes')
      .invoke(async (params) => {
        logger.info('get result themes');

        const result = await getThemes();
        params.setResult(result);
      })

      .build();
  }
}
