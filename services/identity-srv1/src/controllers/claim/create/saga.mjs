
import logger from '@package/logger';
import { NetworkError } from '@package/errors';

import Sagas from 'node-sagas';

import getClaim from '../../../actions/claim/get';
import createClaim from '../../../actions/claim/create';
import destroyClaim from '../../../actions/claim/destroy';


export default class CopySaga {
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
      .step('Create claim')
      .invoke(async (params) => {
        logger.info('create claim');

        const claim = await createClaim(body);
        params.setClaim(claim);
      })
      .withCompensation(async (params) => {
        logger.info('remove claim');

        const claim = params.getClaim();
        await destroyClaim(claim['uuid']);
      })

      .step('Create claim')
      .invoke(async (params) => {
        logger.info('get created claim');

        const claim = params.getClaim();
        const result = await getClaim(claim['uuid']);

        params.setResult(result);
      })

      .build();
  }
}
