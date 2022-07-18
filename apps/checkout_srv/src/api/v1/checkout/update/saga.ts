
import { InternalServerError } from '@package/errors';

import logger from '@package/logger';

import * as Sagas from 'node-sagas';

import { IParams } from './saga-params';


export default class Saga {
  parent = null;

  constructor(parent) {
    this.parent = parent;
  }

  async execute(params: IParams): Promise<IParams> {
    const saga = await this.getSagaDefinition();
    try {
      return await saga.execute(params);
    }
    catch (e) {
      if (e instanceof Sagas.SagaExecutionFailed) {
        throw new InternalServerError({ code: '100.0.0', message: e['message'] });
      }
      if (e instanceof Sagas.SagaCompensationFailed) {
        throw new InternalServerError({ code: '100.0.1', message: e['message'] });
      }
    }
  }

  async getSagaDefinition(): Promise<any> {
    const { uuid } = this.parent.params;
    const body = this.parent.body;
    const db = this.parent.plugin.get('db');
    // const rabbit = this.parent.plugin.get('rabbit');

    const sagaBuilder = new Sagas.SagaBuilder();

    const Order = db.models['Order'];
    const Product = db.models['Product'];
    const Currency = db.models['Currency'];

    return sagaBuilder
      .step('Get checkout')
      .invoke(async (params: IParams) => {
        logger.info('get order');

        const result = await Order.findOne({
          where: {
            uuid,
          },
          include: [
            {
              model: Product,
              as: 'products',
              include: [
                {
                  model: Currency,
                  as: 'currency',
                }
              ],
            },
            {
              model: Currency,
              as: 'currency',
            },
          ]
        });

        params.setItem(result ? result.toJSON() : null);
      })

      .step('Check checkout')
      .invoke(async (params: IParams) => {
        logger.info('check checkout');

        const checkout = params.getItem();

        if ( ! checkout) {
          await Order.create({
            uuid,
            statusCode: 'bucket',
            price: 0,
            currencyCode: 'RUB',
          });
        }
      })
      .withCompensation(async (params: IParams) => {
        logger.info('destroy checkout');

        const checkout = params.getItem();

        if ( ! checkout) {
          await Order.destroy({
            where: {
              uuid,
            }
          });
        }
      })

      .step('Create products')
      .invoke(async () => {
        logger.info('Create products');

        await Product.destroy({
          where: {
            orderUuid: uuid,
          }
        });

        if ( ! body?.['products']) {
          return void 0;
        }

        await Product.bulkCreate(body['products'].map((item) => ({
          productUuid: item['productUuid'],
          orderUuid: uuid,
          imageUuid: item['imageUuid'],
          modeUuid: item['modeUuid'],
          externalId: item['externalId'],
          title: item['title'],
          originalName: item['originalName'],
          vendor: item['vendor'],
          value: item['value'],
          count: item['count'],
          price: item['price'],
          currencyCode: item['currencyCode'],
        })));
      })

      .step('Update checkout')
      .invoke(async () => {
        logger.info('update checkout');

        const data = {};

        if ( !! body['statusCode']) {
          data['statusCode'] = body['statusCode'];
        }

        if ( !! body['paymentCode']) {
          data['paymentCode'] = body['paymentCode'];
        }

        if ( !! body['deliveryCode']) {
          data['deliveryCode'] = body['deliveryCode'];
        }

        if ( !! body['products']) {
          data['price'] = body['products'].reduce((accum, item) => accum + (item['count'] * item['price']), 0);
        }

        await Order.update(data, {
          where: {
            uuid,
          },
        });
      })

      .step('Get result attribute')
      .invoke(async (params: IParams) => {
        logger.info('get result attribute');

        const result = await Order.findOne({
          where: {
            uuid,
          },
          include: [
            {
              model: Product,
              as: 'products',
              include: [
                {
                  model: Currency,
                  as: 'currency',
                }
              ],
            },
            {
              model: Currency,
              as: 'currency',
            },
          ]
        });

        params.setResult(result.toJSON());
      })

      .build();
  }
}
