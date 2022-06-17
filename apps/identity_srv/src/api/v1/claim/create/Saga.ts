
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
    const body = this.controller['body'];

    return sagaBuilder
      .step('Create claim')
      .invoke(async (params: SagaParams) => {
        logger.info('Create claim');

        const db = this.controller.plugin.get('db');
        const ClaimModel = db.model.get('Claim');

        params.claim = await ClaimModel.create(body);
      })
      .withCompensation(async (params: SagaParams) => {
        logger.info('Remove created claim');

        const db = this.controller.plugin.get('db');
        const ClaimModel = db.model.get('Claim');

        const claim = params.claim;

        if (claim) {
          await ClaimModel.destroy({
            where: {
              uuid: claim['uuid'],
            }
          });
        }
      })

      .step('Get created claim')
      .invoke(async (params: SagaParams) => {
        logger.info('Get created claim');

        const db = this.controller.plugin.get('db');
        const ClaimModel = db.model.get('Claim');

        const claim = params.claim;
        const result = await ClaimModel.findOne({
          where: {
            uuid: claim['uuid'],
          },
        });

        if ( ! claim) {
          throw new Error('Created claim don\'t find');
        }

        params.result = result.toJSON();
      })

      .build();
  }
}
