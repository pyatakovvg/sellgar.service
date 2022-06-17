
import { NetworkError } from '@package/errors';

import logger from '@package/logger';

import Sagas from 'node-sagas';

import getRole from '../../../actions/role/get';
import createRole from '../../../actions/role/create';
import destroyRole from '../../../actions/role/destroy';

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
      console.log(e)
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
      .step('Create role')
      .invoke(async (params) => {
        logger.info('create role');

        const role = await createRole(body);
        params.setRole(role);
      })
      .withCompensation(async (params) => {
        logger.info('rollback role');

        const role = params.getRole();
        await destroyRole(role['uuid']);
      })

      .step('Create permissions')
      .invoke(async (params) => {
        logger.info('create permissions');

        if ( ! body['permissions']) {
          return void 0;
        }

        const role = params.getRole();
        await createPermissions(role['uuid'], body['permissions']);
      })
      .withCompensation(async (params) => {
        logger.info('rollback permissions');

        const role = params.getRole();
        await destroyPermissions(role['uuid']);
      })

      .step('Get created rol')
      .invoke(async (params) => {
        logger.info('get created rol');

        const role = params.getRole();
        const result = await getRole(role['uuid']);

        params.setResult(result);
      })

      .build();
  }
}
