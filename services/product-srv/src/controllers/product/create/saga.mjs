
import { NetworkError } from '@package/errors';

import logger from '@package/logger';
import { sendEvent } from '@sellgar/rabbit';

import Sagas from 'node-sagas';

import getAllProduct from '../../../actions/product/getAll';
import createProduct from '../../../actions/product/create';
import destroyProduct from '../../../actions/product/destroy';

import createModes from '../../../actions/productMode/create';
import destroyModes from '../../../actions/productMode/destroy';

import createGallery from '../../../actions/productGallery/create';
import destroyGallery from '../../../actions/productGallery/destroy';

import createAttributes from '../../../actions/productAttribute/create';
import destroyAttributes from '../../../actions/productAttribute/destroy';


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
        throw new NetworkError({ code: '2.0.0', message: e['message'] });
      }
      if (e instanceof Sagas.SagaCompensationFailed) {
        throw new NetworkError({ code: '2.0.1', message: e['message'] });
      }
    }
  }

  async getSagaDefinition() {
    const sagaBuilder = new Sagas.SagaBuilder();
    const body = this.ctx['request']['body'];

    return sagaBuilder
      .step('Create product')
      .invoke(async (params) => {
        logger.info('create product');

        const result = await createProduct(body);
        params.setProduct(result);
      })
      .withCompensation(async (params) => {
        logger.info('restore product');

        const product = params.getProduct();
        if (product) {
          await destroyProduct(product['uuid']);
        }
      })

      .step('Create gallery')
      .invoke(async (params) => {
        logger.info('create gallery');

        const product = params.getProduct();
        const result = await createGallery(product['uuid'], body['gallery']);
        params.setProductGallery(result);
      })
      .withCompensation(async (params) => {
        logger.info('restore modes');

        const product = params.getProduct();
        const modes = params.getProductGallery();

        if ( ! modes.length) {
          await destroyGallery(product['uuid']);
        }
      })

      .step('Create modes')
      .invoke(async (params) => {
        logger.info('create modes');

        const product = params.getProduct();
        const result = await createModes(product['uuid'], body['modes']);
        params.setProductModes(result);
      })
      .withCompensation(async (params) => {
        logger.info('restore modes');

        const product = params.getProduct();
        const modes = params.getProductModes();

        if ( ! modes.length) {
          await destroyModes(product['uuid']);
        }
      })

      .step('Create attributes')
      .invoke(async (params) => {
        logger.info('create attributes');

        const product = params.getProduct();
        const result = await createAttributes(product['uuid'], body['attributes']);
        params.setProductAttributes(result);
      })
      .withCompensation(async (params) => {
        logger.info('destroy attributes');

        const product = params.getProduct();
        const modes = params.getProductAttributes();

        if ( ! modes.length) {
          await destroyAttributes(product['uuid']);
        }
      })

      .step('Get result product')
      .invoke(async (params) => {
        logger.debug('get result product');

        const product = params.getProduct();
        const result = await getAllProduct({ uuid: product['uuid'] });

        if ( ! result['data'][0]) {
          throw new Error('Can not found created product')
        }

        params.setResult(result['data'][0])
      })

      .step('Send event')
      .invoke(async (params) => {
        logger.debug('send event result product');

        const result = params.getResult();
        await sendEvent(process.env['EXCHANGE_PRODUCT_CREATE'], JSON.stringify(result));
      })

      .build();
  }
}
