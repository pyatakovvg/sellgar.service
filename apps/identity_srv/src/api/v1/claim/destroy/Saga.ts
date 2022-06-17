
import { InternalServerError } from '@package/errors';
import { Controller, logger } from '@library/app';

import { SagaBuilder, SagaExecutionFailed, SagaCompensationFailed } from 'node-sagas';

import SagaParams from "./SagaParams";


class Saga {
  constructor(readonly controller: Controller) {
    this.controller = controller;
  }

  async execute(params) {
    const saga = await this.getSagaDefinition();

    try {
      return await saga.execute(params);
    }
    catch (error) {
      if (error instanceof SagaExecutionFailed) {
        throw new InternalServerError({ code: '100.0.0', message: error['message'] });
      }
      if (error instanceof SagaCompensationFailed) {
        throw new InternalServerError({ code: '100.0.1', message: error['message'] });
      }
    }
  }

  async getSagaDefinition() {
    const { uuid } = this.controller['params'];
    const db = this.controller.plugin.get('db');
    const ClaimModel = db.model.get('Claim');

    const sagaBuilder = new SagaBuilder();

    return sagaBuilder
      .step('Get claim')
      .invoke(async (params: SagaParams) => {
        logger.info('Get claim');

        const claim = await ClaimModel.findOne({
          where: {
            uuid,
          }
        });

        if ( ! claim) {
          throw new Error('Claim don\'t find');
        }

        params.claim = claim.toJSON();
      })
      .withCompensation(async (params: SagaParams) => {
        logger.info('Create claim');

        const claim = params.claim;
        await ClaimModel.create({
          uuid: claim['uuid'],
          type: claim['type'],
          description: claim['description'],
        });
      })

      .step('Destroy claim')
      .invoke(async () => {
        logger.info('Destroy claim');

        await ClaimModel.destroy({
          where: {
            uuid,
          }
        });
      })

      .build();
  }
}

export default Saga;
