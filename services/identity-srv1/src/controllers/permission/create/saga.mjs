
import { NetworkError } from '@package/errors';

import logger from '@package/logger';

import Sagas from 'node-sagas';

import getPermission from '../../../actions/permission/get';
import createPermission from '../../../actions/permission/create';
import destroyPermission from '../../../actions/permission/destroy';


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
      .step('Create permission')
      .invoke(async (params) => {
        logger.info('create permission');

        const permission = await createPermission(body);
        params.setPermission(permission);
      })
      .withCompensation(async (params) => {
        logger.info('remove permission');

        const permission = params.getPermission();
        await destroyPermission(permission['uuid']);
      })

      .step('Create permission')
      .invoke(async (params) => {
        logger.info('get created permission');

        const permission = params.getPermission();
        const result = await getPermission(permission['uuid']);

        params.setResult(result);
      })

      .build();
  }
}
