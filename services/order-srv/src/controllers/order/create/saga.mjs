
import { NetworkError } from "@package/errors";

import logger from '@package/logger';
import { sendEvent } from '@sellgar/rabbit';

import Sagas from 'node-sagas';

import getCustomer from "../_base/customer/get";
import createCustomer from "../_base/customer/create";

import createAddress from "../_base/address/create";
import destroyAddress from "../_base/address/destroy";

import getOrder from '../_base/order/get';
import updateOrder from '../_base/order/update';
import createOrder from '../_base/order/create';
import destroyOrder from '../_base/order/destroy';

import getProducts from '../_base/product/get';
import createProducts from '../_base/product/create';
import destroyProducts from '../_base/product/destroy';


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

    const body = ctx['request']['body'];

    return sagaBuilder
      .step('Create order')
      .invoke(async (params) => {
        logger.info('Create order');
        const orderUuid = await createOrder(body);

        params.setOrderUuid(orderUuid);
      })
      .withCompensation(async (params) => {
        logger.info('Restore created order');
        const orderUuid = params.getOrderUuid();

        await destroyOrder(orderUuid);
      })

      .step('Create address')
      .invoke(async (params) => {
        logger.info('Create address');
        const orderUuid = params.getOrderUuid();

        await createAddress(orderUuid, body['address']);
      })
      .withCompensation(async (params) => {
        logger.info('Restore address');
        const orderUuid = params.getOrderUuid();

        await destroyAddress(orderUuid);
      })

      .step('Create products')
      .invoke(async (params) => {
        logger.info('Create products');
        const orderUuid = params.getOrderUuid();

        await createProducts(orderUuid, body['products']);
      })
      .withCompensation(async (params) => {
        logger.info('Restore update products');
        const orderUuid = params.getOrderUuid();

        await destroyProducts(orderUuid);
      })

      .step('Create customer')
      .invoke(async (params) => {
        logger.info('Create customer');
        if ( ! body['customer']) {
          return void 0;
        }

        const customer = await getCustomer({
          uuid: body['userUuid'],
        });

        if ( ! customer[0]) {
          const newCustomer = await createCustomer(body['userUuid'], body['customer']);
          params.setCustomer(newCustomer);
        }
        else {
          params.setCustomer(customer[0]);
        }
      })

      .step('Update order')
      .invoke(async (params) => {
        logger.info('Update order');
        const orderUuid = params.getOrderUuid();
        const products = await getProducts(orderUuid);

        if (products.length) {
          const total = products.reduce((prev, next) => prev + next['total'], 0);

          await updateOrder(orderUuid, {
            total,
            currencyCode: products[0]['currencyCode'],
          });
        }
      })

      .step('Get created order')
      .invoke(async (params) => {
        logger.info('Get updated order');
        const orderUuid = params.getOrderUuid();
        const order = await getOrder(orderUuid);

        params.setFinishOrder(order);
      })

      .step('Send event')
      .invoke(async (params) => {
        const order = params.getFinishOrder();

        await sendEvent(process.env['EXCHANGE_ORDER_CREATE'], JSON.stringify(order));
      })

      .build();
  }
}
