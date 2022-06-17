
import logger from '@package/logger';
import { NetworkError } from '@package/errors';

import Sagas from 'node-sagas';

import getAllGroups from '../../../actions/group/getAll';


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
    const { include } = this.ctx['request']['query'];

    return sagaBuilder
      .step('Get result groups')
      .invoke(async (params) => {
        logger.info('get result groups');
        const includeAt = (include instanceof Array) ? include : [include];

        const result = await getAllGroups(includeAt);
        params.setResult(result);
      })

      .build();
  }
}
