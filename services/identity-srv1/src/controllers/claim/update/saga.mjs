
import { NetworkError } from '@package/errors';

import logger from '@package/logger';

import Sagas from 'node-sagas';

import getClaim from '../../../actions/claim/get';
import updateClaim from '../../../actions/claim/update';


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
        throw new NetworkError({ code: '100.0.0', message: e['message'] });
      }
      if (e instanceof Sagas.SagaCompensationFailed) {
        throw new NetworkError({ code: '100.0.1', message: e['message'] });
      }
    }
  }

  async getSagaDefinition() {
    const sagaBuilder = new Sagas.SagaBuilder();
    const { uuid } = this.ctx['params'];
    const body = this.ctx['request']['body'];

    return sagaBuilder
      .step('Get claim')
      .invoke(async (params) => {
        logger.info('Get claim');

        const claim = await getClaim(uuid);

        if ( ! claim) {
          throw new Error('Claim don\'t find');
        }

        params.setClaim(claim);
      })

      .step('Update claim')
      .invoke(async () => {
        logger.info('Update claim');

        await updateClaim({ uuid, ...body });
      })
      .withCompensation(async (params) => {
        logger.info('remove claim');

        const claim = params.getClaim();
        await updateClaim(claim);
      })

      .step('Get claim')
      .invoke(async (params) => {
        logger.info('Get updated claim');

        const claim = params.getClaim();
        const result = await getClaim(claim['uuid']);

        params.setResult(result);
      })

      .build();
  }
}
