
import logger from '@package/logger';
import { NetworkError } from '@package/errors';

import Sagas from 'node-sagas';

import getRole from '../../../actions/role/get';
import updateRole from '../../../actions/role/update';

import createPermissions from '../../../actions/rolePermission/create';
import destroyPermissions from '../../../actions/rolePermission/destroy';


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
      .step('Get role')
      .invoke(async (params) => {
        logger.info('get role');

        const role = await getRole(uuid);
        params.setRole(role);
      })

      .step('Update role')
      .invoke(async () => {
        logger.info('update role');

        await updateRole(uuid, body);
      })
      .withCompensation(async (params) => {
        logger.info('rollback role');

        const role = params.getRole();
        await updateRole(uuid, role);
      })

      .step('create permissions')
      .invoke(async () => {
        logger.info('create permissions');

        if ( ! body['permissions']) {
          return void 0;
        }
        await destroyPermissions(uuid);
        await createPermissions(uuid, body['permissions'])
      })
      .withCompensation(async(params) => {
        logger.info('rollback permissions');

        const role = params.getRole();
        await destroyPermissions(uuid);
        await createPermissions(uuid, role['permissions'].map((item) => item['uuid']));
      })

      .step('Get updated rol')
      .invoke(async (params) => {
        logger.info('get created rol');

        const result = await getRole(uuid);
        params.setResult(result);
      })

      .build();
  }
}
