
import { NetworkError } from "@package/errors";

import logger from '@package/logger';
import { sendEvent } from '@sellgar/rabbit';

import Sagas from 'node-sagas';

import getOrder from './order/get';
import createOrder from './order/create';
import destroyOrder from './order/destroy';

import createProducts from './product/create';
import destroyProducts from './product/destroy';


export default class Saga {
  ctx = null;

  constructor(ctx) {
    this.ctx = ctx;
  }

  async execute(params) {
    const saga = await this.sagaDefinition(this.ctx);
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

  async sagaDefinition(ctx) {
    const sagaBuilder = new Sagas.SagaBuilder();

    const { uuid } = ctx['request']['body'];

    return sagaBuilder
      .step('Get order')
      .invoke(async (params) => {
        logger.info('Get order');
        const order = await getOrder(uuid);
        params.setOrder(order);
      })

      .step('Destroy products')
      .invoke(async (params) => {
        logger.info('Destroy products');
        const order = params.getOrder();
        await destroyProducts(order['products']);
      })
      .withCompensation(async (params) => {
        logger.info('Restore destroy products');
        const order = params.getOrder();
        await createProducts(order['products']);
      })

      .step('Destroy order')
      .invoke(async () => {
        logger.info('Destroy order');
        await destroyOrder(uuid);
      })
      .withCompensation(async (params) => {
        logger.info('Restore destroy order');
        const order = params.getOrder();
        await createOrder(uuid, order);
      })

      .step('Send event')
      .invoke(async () => {
        await sendEvent(process.env['EXCHANGE_ORDER_DELETE'], JSON.stringify(uuid));
      })

      .build();
  }
}
