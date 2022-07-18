
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
        console.log(e)
        throw new InternalServerError({ code: '100.0.1', message: e['message'] });
      }
    }
  }

  async getSagaDefinition(): Promise<any> {
    const db = this.parent.plugin.get('db');
    const rabbit = this.parent.plugin.get('rabbit');

    const sagaBuilder = new Sagas.SagaBuilder();

    const Product = db.models['Product'];

    return sagaBuilder
      .step('Create product template')
      .invoke(async (params: IParams) => {
        logger.info('create product template');

        const result = await Product.create({});
        params.setItem(result);
      })
      .withCompensation(async (params: IParams) => {
        logger.info('remove brand');

        const item = params.getItem();
        if (item) {
          await Product.destroy({
            where: {
              uuid: item['uuid'],
            }
          });
        }
      })

      .step('Get result product template')
      .invoke(async (params: IParams) => {
        logger.info('get result product template');

        const item = params.getItem();

        const result = await Product.findOne({
          where: {
            uuid: item['uuid'],
          },
        });

        params.setResult(result.toJSON());
      })

      .step('Send event result product')
      .invoke(async (params: IParams) => {
        logger.debug('send event result product');

        const result = params.getResult();
        await rabbit.sendEvent(process.env['PRODUCT_SRV_PRODUCT_UPDATE_EXCHANGE'], result);
      })

      .build();
  }
}
