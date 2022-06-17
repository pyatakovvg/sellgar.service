
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
      .step('Create permission')
      .invoke(async (params) => {
        logger.info('Get permission');

        const permission = await getPermission(uuid);

        params.setPermission(permission);
      })
      .withCompensation(async (params) => {
        logger.info('Create permission');

        const permission = params.getPermission();
        await createPermission(permission);
      })

      .step('Create permission')
      .invoke(async () => {
        logger.info('Destroy permission');

        await destroyPermission(uuid);
      })

      .build();
  }
}
