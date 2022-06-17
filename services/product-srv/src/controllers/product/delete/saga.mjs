
import logger from '@package/logger';
import { sendEvent } from '@sellgar/rabbit';
import { NetworkError } from '@package/errors';

import Sagas from 'node-sagas';

import getProduct from '../../../actions/product/get';
import createProduct from '../../../actions/product/create';
import destroyProduct from '../../../actions/product/destroy';

import getModes from '../../../actions/productMode/get';
import createModes from '../../../actions/productMode/create';
import destroyModes from '../../../actions/productMode/destroy';

import getGallery from '../../../actions/productGallery/get';
import createGallery from '../../../actions/productGallery/create';
import destroyGallery from '../../../actions/productGallery/destroy';

import getAttributes from '../../../actions/productAttribute/get';
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

    const { uuid } = this.ctx['params'];

    return sagaBuilder
      .step('Get product')
      .invoke(async(params) => {
        logger.info('get product');

        const result = await getProduct(uuid);
        params.setProduct(result);
      })

      .step('Update gallery')
      .invoke(async(params) => {
        logger.info('destroy gallery');

        const gallery = await getGallery(uuid);
        await destroyGallery(uuid);
        params.setGallery(gallery);
      })
      .withCompensation(async(params) => {
        logger.info('restore gallery');

        const gallery = params.getGallery();
        await createGallery(uuid, gallery.map((item) => item['imageUuid']));
      })

      .step('Destroy modes')
      .invoke(async(params) => {
        logger.info('destroy modes');

        const modes = await getModes(uuid);
        await destroyModes(uuid);
        params.setModes(modes);
      })
      .withCompensation(async(params) => {
        logger.info('restore modes');

        const modes = params.getModes();
        await createModes(uuid, modes);
      })

      .step('Destroy attributes')
      .invoke(async(params) => {
        logger.info('destroy attributes');

        const attrs = await getAttributes(uuid);

        await destroyAttributes(uuid);
        params.setAttributes(attrs);
      })
      .withCompensation(async(params) => {
        logger.info('restore attributes');

        const attrs = params.getAttributes();
        await createAttributes(uuid, attrs.map((attr) => ({
          value: attr['value'],
          uuid: attr['attributeUuid'],
        })));
      })

      .step('Destroy product')
      .invoke(async() => {
        logger.info('destroy product');

        await destroyProduct(uuid);
      })
      .withCompensation(async(params) => {
        logger.info('restore product');

        const product = params.getProduct();
        await createProduct(product);
      })

      .step('Send event')
      .invoke(async() => {
        logger.debug('send event result product');

        await sendEvent(process.env['EXCHANGE_PRODUCT_DELETE'], JSON.stringify(uuid));
      })

      .build();
  }
}
