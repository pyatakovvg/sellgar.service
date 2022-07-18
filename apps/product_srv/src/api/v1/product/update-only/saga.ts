
import logger from '@package/logger';
// import { sendEvent } from '@sellgar/rabbit';
import { InternalServerError } from "@package/errors";

import * as Sagas from 'node-sagas';

import { IParams } from './saga-params';
import Product from './product';


export default class Saga {
  parent: any = null;

  constructor(parent) {
    this.parent = parent;
  }

  async execute(params: IParams) {
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
    const sagaBuilder = new Sagas.SagaBuilder();

    const body = this.parent['body'];
    const { uuid } = this.parent['params'];

    const rabbit = this.parent.plugin.get('rabbit');

    const product = new Product(this.parent);

    return sagaBuilder
      .step('Get product')
      .invoke(async (params: IParams) => {
        logger.info('get product');

        const result = await product.getOnlyOneByUuid(uuid);
        params.setProduct(result);
      })

      .step('Update product')
      .invoke(async() => {
        logger.info('update product');

        await product.update(uuid, body);
      })
      .withCompensation(async(params: IParams) => {
        logger.info('restore product');

        const product = params.getProduct();
        await product.update(uuid, product);
      })

      .step('Get result product')
      .invoke(async (params: IParams) => {
        logger.info('get result product');

        const result = await product.getByUuid(uuid);
        params.setResult(result);
      })

      .step('Send event')
      .invoke(async (params: IParams) => {
        logger.debug('send event result product');

        const result = params.getResult();
        await rabbit.sendEvent(process.env['PRODUCT_SRV_PRODUCT_UPDATE_EXCHANGE'], result);
      })

      .build();
  }
}
