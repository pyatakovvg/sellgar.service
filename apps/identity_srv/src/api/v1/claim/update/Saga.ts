
import { NetworkError, logger, Controller } from '@library/app';

import { SagaBuilder, SagaCompensationFailed, SagaExecutionFailed } from 'node-sagas';

import SagaParams from "./SagaParams";


export default class CopySaga {
  constructor(readonly controller: Controller) {
    this.controller = controller;
  }

  async execute(params: SagaParams): Promise<any> {
    const saga = await this.getSagaDefinition();
    try {
      return await saga.execute(params);
    }
    catch (e) {
      if (e instanceof SagaExecutionFailed) {
        throw new NetworkError({ code: '100.0.0', message: e['message'] });
      }
      if (e instanceof SagaCompensationFailed) {
        throw new NetworkError({ code: '100.0.1', message: e['message'] });
      }
    }
  }

  async getSagaDefinition() {
    const sagaBuilder = new SagaBuilder();
    const { uuid } = this.controller['params'];
    const body = this.controller['body'];

    return sagaBuilder
      .step('Get claim')
      .invoke(async (params: SagaParams) => {
        logger.info('Get claim');

        const db = this.controller.plugin.get('db');
        const ClaimModel = db.model.get('Claim');

        const claim = await ClaimModel.findOne({
          where: {
            uuid,
          },
        });

        if ( ! claim) {
          throw new Error('Claim don\'t find');
        }

        params.claim = claim.toJSON();
      })

      .step('Update claim')
      .invoke(async () => {
        logger.info('Update claim');

        const db = this.controller.plugin.get('db');
        const ClaimModel = db.model.get('Claim');

        await ClaimModel.update(body, {
          where: {
            uuid,
          }
        });
      })
      .withCompensation(async (params: SagaParams) => {
        logger.info('remove claim');

        const db = this.controller.plugin.get('db');
        const ClaimModel = db.model.get('Claim');

        const claim = params.claim;
        await ClaimModel.update(claim, {
          where: {
            uuid,
          }
        });
      })

      .step('Get updated claim')
      .invoke(async (params: SagaParams) => {
        logger.info('Get updated claim');

        const db = this.controller.plugin.get('db');
        const ClaimModel = db.model.get('Claim');

        const claim = params.claim;
        const result = await ClaimModel.findOne({
          where: {
            uuid: claim['uuid'],
          },
        });

        if ( ! result) {
          throw new Error('Created claim don\'t find');
        }

        params.result = result.toJSON();
      })

      .build();
  }
}
