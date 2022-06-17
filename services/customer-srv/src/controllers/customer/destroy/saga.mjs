
import { NetworkError } from '@package/errors';

import logger from '@package/logger';

import Sagas from 'node-sagas';

import getCustomer from '../../../actions/customer/get';
import createCustomer from '../../../actions/customer/create';
import destroyCustomer from '../../../actions/customer/destroy';

import createProfile from '../../../actions/profile/create';
import destroyProfile from '../../../actions/profile/destroy';
import {sendEvent} from "@sellgar/rabbit";


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

    return sagaBuilder
      .step('Get customer')
      .invoke(async (params) => {
        logger.info('get customer');

        const customer = await getCustomer(uuid);
        params.setCustomer(customer);
      })

      .step('Destroy customer')
      .invoke(async () => {
        logger.info('destroy customer');

        await destroyCustomer(uuid);
      })
      .withCompensation(async (params) => {
        logger.info('rollback customer');

        const customer = params.getCustomer();
        await createCustomer(customer);
      })

      .step('Destroy profile')
      .invoke(async (params) => {
        logger.info('destroy profile');

        const customer = params.getCustomer();
        await destroyProfile(customer['profile']['uuid']);
      })
      .withCompensation(async (params) => {
        logger.info('rollback profile');

        const customer = params.getCustomer();
        await createProfile(customer['profile']);
      })

      .step('Sent deleted event')
      .invoke(async (params) => {
        logger.info('send event');

        const customer = params.getCustomer();
        await sendEvent(process.env['EXCHANGE_CUSTOMER_DELETE'], JSON.stringify(customer));
      })

      .build();
  }
}
