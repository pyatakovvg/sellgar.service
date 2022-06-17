
import { NetworkError, logger, Controller } from '@library/app';

import { SagaBuilder, SagaCompensationFailed, SagaExecutionFailed } from 'node-sagas';

import SagaParams from "./SagaParams";


export default class CopySaga {
  constructor(readonly controller: Controller) {
    this.controller = controller;
  }

  async execute(params): Promise<any> {
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
    const body = this.controller.body;

    return sagaBuilder
      .step('Create permission')
      .invoke(async (params: SagaParams) => {
        logger.info('Create permission');

        const db = this.controller.plugin.get('db');
        const PermissionModel = db.model.get('Permission');

        params.permission = await PermissionModel.create(body);
      })
      .withCompensation(async (params: SagaParams) => {
        logger.info('remove permission');

        // const permission = params.permission;
        
        // await destroyPermission(permission['uuid']);
      })

      .step('Create permission')
      .invoke(async (params) => {
        logger.info('get created permission');

        // const permission = params.getPermission();
        // const result = await getPermission(permission['uuid']);
        //
        // params.setResult(result);
      })

      .build();
  }
}
