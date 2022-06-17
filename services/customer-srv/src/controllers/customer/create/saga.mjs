
import { NetworkError } from '@package/errors';

import logger from '@package/logger';
import { sendEvent } from '@sellgar/rabbit';

import Sagas from 'node-sagas';

import getCustomer from '../../../actions/customer/get';
import createCustomer from '../../../actions/customer/create';
import destroyCustomer from '../../../actions/customer/destroy';

import createProfile from '../../../actions/profile/create';
import destroyProfile from '../../../actions/profile/destroy';


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
        throw new NetworkError({ code: '100.0.0', message: e['message'] });
      }
      if (e instanceof Sagas.SagaCompensationFailed) {
        throw new NetworkError({ code: '100.0.1', message: e['message'] });
      }
    }
  }

  async getSagaDefinition() {
    const sagaBuilder = new Sagas.SagaBuilder();
    const body = this.ctx['request']['body'];

    return sagaBuilder
      .step('Create profile')
      .invoke(async (params) => {
        logger.info('create profile');

        const profile = await createProfile(body['profile'] || {});
        params.setProfile(profile);
      })
      .withCompensation(async (params) => {
        logger.info('remove profile');

        const profile = params.getProfile();
        await destroyProfile(profile['uuid']);
      })

      .step('Create customer')
      .invoke(async (params) => {
        logger.info('create customer');

        const profile = params.getProfile();
        const customer = await createCustomer({
          profileUuid: profile['uuid'],
        });
        params.setCustomer(customer);
      })
      .withCompensation(async (params) => {
        logger.info('remove customer');

        const user = params.getCustomer();
        await destroyCustomer(user['uuid']);
      })

      .step('Get result customer')
      .invoke(async (params) => {
        logger.info('get result customer');

        const customer = params.getCustomer();
        const result = await getCustomer(customer['uuid']);

        params.setResult(result);
      })

      .step('Sent created event')
      .invoke(async (params) => {
        logger.info('send event');

        const customer = params.getResult();

        await sendEvent(process.env['EXCHANGE_CUSTOMER_CREATE'], JSON.stringify(customer));
      })

      .build();
  }
}
