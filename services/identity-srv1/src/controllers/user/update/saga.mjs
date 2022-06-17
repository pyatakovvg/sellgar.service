
import logger from '@package/logger';
import { NetworkError } from '@package/errors';

import Sagas from 'node-sagas';

import getUser from '../../../actions/user/get';
import updateUser from '../../../actions/user/update';

import createClaims from '../../../actions/userClaim/create';
import destroyClaims from '../../../actions/userClaim/destroy';

import createRoles from '../../../actions/userRole/create';
import destroyRoles from '../../../actions/userRole/destroy';


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
      .step('Get user')
      .invoke(async (params) => {
        logger.info('get user');

        const user = await getUser(uuid);
        params.setUser(user);
      })

      .step('Update user')
      .invoke(async () => {
        logger.info('update user');

        await updateUser(uuid, body, { useGeneratePassword: true });
      })
      .withCompensation(async (params) => {
        logger.info('rollback user');

        const user = params.getUser();
        await updateUser(uuid, user, { useGeneratePassword: false });
      })

      .step('Create claims')
      .invoke(async () => {
        logger.info('update claims');

        if ( ! body['claims']) {
          return void 0;
        }

        await destroyClaims(uuid);
        await createClaims(uuid, body['claims'].map((item) => ({ uuid: item['uuid'], value: item['value'] })));
      })
      .withCompensation(async (params) => {
        logger.info('destroy claims');

        const user = params.getUser();
        await destroyClaims(user['uuid']);
        await createClaims(uuid, user['claims'].map((item) => ({ uuid: item['uuid'], value: item['UserClaim']['value'] })));
      })

      .step('Create roles')
      .invoke(async () => {
        logger.info('update roles');

        if ( ! body['roles']) {
          return void 0;
        }

        await destroyRoles(uuid);
        await createRoles(uuid, body['roles']);
      })
      .withCompensation(async (params) => {
        logger.info('destroy roles');

        const user = params.getUser();
        await destroyRoles(uuid);
        await createRoles(uuid, user['roles'].map((role) => role['uuid']));
      })

      .step('Get created user')
      .invoke(async (params) => {
        logger.info('get updated user');

        const user = params.getUser();
        const result = await getUser(user['uuid']);

        params.setResult(result);
      })

      .build();
  }
}
