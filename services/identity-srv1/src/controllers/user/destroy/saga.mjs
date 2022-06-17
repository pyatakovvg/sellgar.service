
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


export default class Saga {
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

    return sagaBuilder
      .step('Get user')
      .invoke(async (params) => {
        logger.info('get user');

        const user = await getUser(uuid);
        params.setUser(user);
      })

      .step('Destroy claims')
      .invoke(async () => {
        logger.info('destroy claims');

        await destroyUserClaims(uuid);
      })
      .withCompensation(async (params) => {
        logger.info('Create permission');

        const user = params.getUser();
        await createUserClaims(uuid, user['claims'].map((item) => ({ uuid: item['uuid'], value: item['UserClaim']['value'] })));
      })

      .step('Destroy roles')
      .invoke(async () => {
        logger.info('destroy roles');

        await destroyUserRoles(uuid);
      })
      .withCompensation(async (params) => {
        logger.info('create roles');

        const user = params.getUser();
        await createUserRoles(uuid, user['roles'].map((role) => role['uuid']));
      })

      .step('Destroy user')
      .invoke(async () => {
        logger.info('destroy user');

        await destroyUser(uuid);
      })
      .withCompensation(async (params) => {
        logger.info('rollback user');

        const user = params.getUser();
        await createUser(user, { useGeneratePassword: false });
      })

      .build();
  }
}
