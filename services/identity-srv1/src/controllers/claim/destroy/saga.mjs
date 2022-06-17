
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

    return sagaBuilder
      .step('Create claim')
      .invoke(async (params) => {
        logger.info('Get claim');

        const claim = await getClaim(uuid);

        if ( ! claim) {
          throw new Error('Claim don\'t find');
        }

        params.setClaim(claim);
      })
      .withCompensation(async (params) => {
        logger.info('Create claim');

        const claim = params.getClaim();
        await createClaim(claim);
      })

      .step('Create claim')
      .invoke(async () => {
        logger.info('Destroy claim');

        await destroyClaim(uuid);
      })

      .build();
  }
}
