
import numeral from "@sellgar/numeral";
import { NetworkError } from "@package/errors";

import logger from '@package/logger';
import { sendEvent, sendCommand } from '@sellgar/rabbit';

import Sagas from 'node-sagas';

import getCustomer from '../_base/customer/get';
import createCustomer from '../_base/customer/create';
import updateCustomer from '../_base/customer/update';

import updateAddress from '../_base/address/update';

import getOrder from '../_base/order/get';
import updateOrder from '../_base/order/update';

import getProducts from '../_base/product/get';
import updateProducts from '../_base/product/update';


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

    const { uuid } = ctx['params'];
    const body = ctx['request']['body'];

    return sagaBuilder
      .step('Get order')
      .invoke(async (params) => {
        logger.info('Get order');
        const order = await getOrder(uuid);

        params.setOrder(order);
      })

      .step('Update order')
      .invoke(async () => {
        logger.info('Update order');

        await updateOrder(uuid, body);
      })
      .withCompensation(async (params) => {
        logger.info('Restore update order');
        const order = params.getOrder();

        await updateOrder(uuid, order);
      })

      .step('Update address')
      .invoke(async () => {
        if ( ! body['address']) {
          return void 0;
        }
        logger.info('Update address');

        await updateAddress(uuid, body['address']);
      })
      .withCompensation(async (params) => {
        logger.info('Restore update address');
        const order = params.getOrder();

        await updateAddress(uuid, order['address']);
      })

      .step('Update products')
      .invoke(async () => {
        if ( ! body['products']) {
          return void 0;
        }
        logger.info('Update products');

        await updateProducts(uuid, body['products']);
      })
      .withCompensation(async (params) => {
        logger.info('Restore update products');
        const order = params.getOrder();

        await updateProducts(uuid, order['products'].map((product) => ({
          ...product,
          currencyCode: product['currency']['code'],
        })));
      })

      .step('Update customer')
      .invoke(async (params) => {
        logger.info('Update customer');
        const order = params.getOrder();
        const customer = await getCustomer({
          uuid: order['userUuid'],
        });

        if (customer[0]) {
          const result = await updateCustomer({
            ...customer[0],
            ...body['customer'],
          });
          params.setCustomer(result);
        }
        else {
          const result = await createCustomer(order['userUuid'], body['customer']);
          params.setCustomer(result);
        }
      })

      .step('Update order')
      .invoke(async () => {
        logger.info('Update order');

        if (body['products'] && body['products'].length) {
          const products = await getProducts(uuid);
          const total = !! products.length
            ? products.reduce((prev, next) => prev + next['total'], 0)
            : 0;

          await updateOrder(uuid, {
            total,
          });
        }
      })
      .withCompensation(async (params) => {
        logger.info('Restore order');
        const order = params.getOrder();

        await updateOrder(uuid, {
          ...order,
        });
      })

      .step('Get updated order')
      .invoke(async (params) => {
        logger.info('Get updated order');
        const order = await getOrder(uuid);

        params.setFinishOrder(order);
      })

      .step('Send event')
      .invoke(async (params) => {
        const order = params.getFinishOrder();

        await sendEvent(process.env['EXCHANGE_ORDER_UPDATE'], JSON.stringify(order));
      })

      .step('Send command to mail')
      .invoke(async (params) => {
        const order = params.getFinishOrder();

        if (order['status']['code'] === 'basket') {
          return void 0;
        }

        await sendCommand(process.env['QUEUE_MAIL_ORDER_UPDATE'], JSON.stringify(order));
      })

      .step('Send command to push-notification')
      .invoke(async (params) => {
        const order = params.getFinishOrder();

        if (order['status']['code'] === 'basket') {
          return void 0;
        }

        const externalId = order['externalId'].toUpperCase().replace(/(\w{3})(\w{3})(\w{3})/, '$1-$2-$3');

        let message = '';
        if (order['status']['code'] === 'new') {
          message = 'Оформлен заказ #' + externalId + ' на сумму ' + numeral(order['total']).format() + order['currency']['displayName'];
        }
        else if (order['status']['code'] === 'confirmed') {
          message = 'Заказ #' + externalId + ' на сумма ' + numeral(order['total']).format() + order['currency']['displayName'] + ' подтвержден';
        }
        else if (order['status']['code'] === 'canceled') {
          message = 'Заказ #' + externalId + ' отменен';
        }
        else if (order['status']['code'] === 'process') {
          message = 'Заказ #' + externalId + ' готовится';
        }
        else if (order['status']['code'] === 'done') {
          message = 'Заказ #' + externalId + ' готов';
        }
        else if (order['status']['code'] === 'finished') {
          message = 'Заказ #' + externalId + ' выполнен. Приятного аппетита!';
        }

        await sendCommand(process.env['QUEUE_PUSH_SEND'], JSON.stringify({
          title: 'Пекарня "Осетинские прироги"',
          message: message,
          userUuid: order['userUuid'],
        }));
      })

      .step('Send command to push-notification for admins')
      .invoke(async (params) => {
        const order = params.getFinishOrder();

        if (order['status']['code'] !== 'new') {
          return void 0;
        }

        const externalId = order['externalId'].toUpperCase().replace(/(\w{3})(\w{3})(\w{3})/, '$1-$2-$3');

        const customers = await getCustomer({
          type: 'admin',
        });

        for (let customer in customers) {
          const userUuid = customers[customer]['uuid'];

          await sendCommand(process.env['QUEUE_PUSH_SEND'], JSON.stringify({
            title: 'Пекарня "Осетинские прироги"',
            message: 'Поступил новый заказ ' + externalId + '.',
            userUuid: userUuid,
          }));
        }
      })

      .step('Send command to semySms')
      .invoke(async (params) => {
        const order = params.getFinishOrder();

        if (order['status']['code'] === 'basket' || order['status']['code'] === 'new') {
          return void 0;
        }

        const externalId = order['externalId'].toUpperCase().replace(/(\w{3})(\w{3})(\w{3})/, '$1-$2-$3');

        let message = '';
        if (order['status']['code'] === 'confirmed') {
          message = 'Заказ #' + externalId + ' на сумма ' + numeral(order['total']).format() + order['currency']['displayName'] + ' подтвержден';
        }
        else if (order['status']['code'] === 'canceled') {
          message = 'Заказ #' + externalId + ' отменен';
        }
        else if (order['status']['code'] === 'process') {
          message = 'Заказ #' + externalId + ' готовится';
        }
        else if (order['status']['code'] === 'done') {
          message = 'Заказ #' + externalId + ' готов';
        }
        else if (order['status']['code'] === 'finished') {
          message = 'Заказ #' + externalId + ' выполнен. Приятного аппетита!';
        }

        await sendCommand(process.env['QUEUE_SEMYSMS_SEND'], JSON.stringify({
          message: message,
          phone: order['customer']['phone'],
        }));
      })

      .step('Send command to semySms for admins')
      .invoke(async (params) => {
        const order = params.getFinishOrder();

        if (order['status']['code'] !== 'new') {
          return void 0;
        }

        const externalId = order['externalId'].toUpperCase().replace(/(\w{3})(\w{3})(\w{3})/, '$1-$2-$3');

        const customers = await getCustomer({
          type: 'admin',
        });

        for (let customer in customers) {
          const phone = customers[customer]['phone'];

          await sendCommand(process.env['QUEUE_SEMYSMS_SEND'], JSON.stringify({
            message: 'Поступил новый заказ №' + externalId,
            phone: phone,
          }));
        }
      })

      .build();
  }
}
