
import { NetworkError } from '@package/errors';

import logger from '@package/logger';

import Sagas from 'node-sagas';

import getUser from '../../../actions/user/get';
import createUser from '../../../actions/user/create';
import destroyUser from '../../../actions/user/destroy';

import createUserClaims from '../../../actions/userClaim/create';
import destroyUserClaims from '../../../actions/userClaim/destroy';

import createUserRoles from '../../../actions/userRole/create';
import destroyUserRoles from '../../../actions/userRole/destroy';


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
      .step('Create user')
      .invoke(async (params) => {
        logger.info('create user');

        const user = await createUser(body, { useGeneratePassword: true });
        params.setUser(user);
      })
      .withCompensation(async (params) => {
        logger.info('remove user');

        const user = params.getUser();
        await destroyUser(user['uuid']);
      })

      .step('Create claims')
      .invoke(async (params) => {
        logger.info('create claims');

        if ( ! body['claims']) {
          return void 0;
        }

        const user = params.getUser();
        await createUserClaims(user['uuid'], body['claims']);
      })
      .withCompensation(async (params) => {
        logger.info('rollback claims');

        const user = params.getUser();
        await destroyUserClaims(user['uuid']);
      })

      .step('Create roles')
      .invoke(async (params) => {
        logger.info('create roles');

        if ( ! body['roles']) {
          return void 0;
        }

        const user = params.getUser();
        await createUserRoles(user['uuid'], body['roles']);
      })
      .withCompensation(async (params) => {
        logger.info('rollback roles');

        const user = params.getUser();
        await destroyUserRoles(user['uuid']);
      })

      .step('Get created user')
      .invoke(async (params) => {
        logger.info('get created user');

        const user = params.getUser();
        const result = await getUser(user['uuid']);

        params.setResult(result);
      })

      .build();
  }
}
