
import { NetworkError } from '@package/errors';

import logger from '@package/logger';
import { sendEvent } from '@sellgar/rabbit';

import Sagas from 'node-sagas';

import getCustomer from '../../../actions/customer/get';
import updateCustomer from '../../../actions/customer/update';

import getProfile from '../../../actions/profile/get';
import updateProfile from '../../../actions/profile/update';


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
      console.log(e)
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
    const body = this.ctx['request']['body'];

    return sagaBuilder
      .step('Get customer')
      .invoke(async (params) => {
        logger.info('get customer');

        const customer = await getCustomer(uuid);
        params.setCustomer(customer);
      })

      .step('Update customer')
      .invoke(async () => {
        logger.info('update customer');

        await updateCustomer(uuid, { uuid });
      })
      .withCompensation(async (params) => {
        logger.info('rollback customer');

        const customer = params.getCustomer();
        await updateCustomer(uuid, customer);
      })

      .step('Get profile')
      .invoke(async (params) => {
        logger.info('get profile');

        const customer = params.getCustomer();
        const profile = await getProfile(customer['profile']['uuid']);
        params.setProfile(profile);
      })

      .step('Update profile')
      .invoke(async (params) => {
        logger.info('update profile');

        const profile = params.getProfile();
        await updateProfile(profile['uuid'], body['profile'] ?? {});
      })
      .withCompensation(async (params) => {
        logger.info('rollback profile');

        const profile = params.getProfile();
        await updateProfile(profile['uuid'], profile);
      })

      .step('Get result customer')
      .invoke(async (params) => {
        logger.info('get result customer');

        const result = await getCustomer(uuid);
        params.setResult(result);
      })

      .step('Sent updated event')
      .invoke(async (params) => {
        logger.info('send event');

        const customer = params.getResult();

        await sendEvent(process.env['EXCHANGE_CUSTOMER_UPDATE'], JSON.stringify(customer));
      })

      .build();
  }
}
