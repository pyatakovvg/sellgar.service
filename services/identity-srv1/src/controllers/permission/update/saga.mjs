
import { NetworkError } from '@package/errors';

import logger from '@package/logger';

import Sagas from 'node-sagas';

import getPermission from '../../../actions/permission/get';
import updatePermission from '../../../actions/permission/update';


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
    const { uuid } = this.ctx['params'];
    const body = this.ctx['request']['body'];

    return sagaBuilder
      .step('Get permission')
      .invoke(async (params) => {
        logger.info('Get permission');

        const permission = await getPermission(uuid);
        params.setPermission(permission);
      })

      .step('Update permission')
      .invoke(async () => {
        logger.info('Update permission');

        await updatePermission({ uuid, ...body });
      })
      .withCompensation(async (params) => {
        logger.info('remove permission');

        const permission = params.getPermission();
        await updatePermission(permission);
      })

      .step('Get permission')
      .invoke(async (params) => {
        logger.info('Get updated permission');

        const permission = params.getPermission();
        const result = await getPermission(permission['uuid']);

        params.setResult(result);
      })

      .build();
  }
}
