
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
    const db = this.parent.plugin.get('db');
    const sagaBuilder = new Sagas.SagaBuilder();

    const Order = db.models['Order'];
    const Product = db.models['Product'];
    const Currency = db.models['Currency'];

    return sagaBuilder
      .step('Get checkout')
      .invoke(async (params: IParams) => {
        logger.info('get checkout');

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
          ]
        });

        params.setItem(result ? result.toJSON() : null);
      })

      .step('Destroy checkout')
      .invoke(async () => {
        logger.info('destroy checkout');

        await Order.destroy({
          where: {
            uuid,
          }
        });
      })
      .withCompensation(async () => {
        logger.info('destroy checkout');

      })

      .step('Destroy products')
      .invoke(async () => {
        logger.info('Create products');

        await Product.destroy({
          where: {
            orderUuid: uuid,
          }
        });
      })

      .build();
  }
}
