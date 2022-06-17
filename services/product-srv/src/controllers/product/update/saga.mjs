
import logger from '@package/logger';
import { sendEvent } from '@sellgar/rabbit';
import { NetworkError } from "@package/errors";

import Sagas from 'node-sagas';

import getProduct from '../../../actions/product/get';
import getAllProduct from '../../../actions/product/getAll';
import updateProduct from '../../../actions/product/update';

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

  async getSagaDefinition(ctx) {
    const sagaBuilder = new Sagas.SagaBuilder();

    const { uuid } = ctx['params'];
    const body = ctx['request']['body'];

    return sagaBuilder
      .step('Get product')
      .invoke(async (params) => {
        logger.info('get product');

        const result = await getProduct(uuid);
        params.setProduct(result);
      })

      .step('Update product')
      .invoke(async() => {
        logger.info('update product');

        await updateProduct(uuid, body);
      })
      .withCompensation(async(params) => {
        logger.info('restore product');

        const product = params.getProduct();
        await updateProduct(uuid, product);
      })

      .step('Update gallery')
      .invoke(async(params) => {
        logger.info('update gallery');

        const gallery = await getGallery(uuid);

        await destroyGallery(uuid);
        await createGallery(uuid, body['gallery']);

        params.setGallery(gallery);
      })
      .withCompensation(async(params) => {
        logger.info('restore gallery');

        const gallery = params.getGallery();

        await destroyGallery(uuid);
        await createGallery(uuid, gallery.map((item) => item['imageUuid']));
      })

      .step('Update modes')
      .invoke(async(params) => {
        logger.info('update modes');

        const modes = await getModes(uuid);

        await destroyModes(uuid);
        await createModes(uuid, body['modes']);

        params.setModes(modes);
      })
      .withCompensation(async(params) => {
        logger.info('restore modes');

        const modes = params.getModes();

        await destroyModes(uuid);
        await createModes(uuid, modes);
      })

      .step('Update attributes')
      .invoke(async(params) => {
        logger.info('update attributes');

        const attrs = await getAttributes(uuid);

        await destroyAttributes(uuid);
        await createAttributes(uuid, body['attributes']);

        params.setAttributes(attrs);
      })
      .withCompensation(async(params) => {
        logger.info('restore attributes');

        const attrs = params.getAttributes();

        await destroyAttributes(uuid);
        await createAttributes(uuid, attrs.map((attr) => ({
          value: attr['value'],
          uuid: attr['attributeUuid'],
        })));
      })

      .step('Get result product')
      .invoke(async (params) => {
        logger.info('get result product');

        const result = await getAllProduct({ uuid });
        params.setResult(result['data'][0]);
      })

      .step('Send event')
      .invoke(async (params) => {
        logger.debug('send event result product');

        const result = params.getResult();
        await sendEvent(process.env['EXCHANGE_PRODUCT_UPDATE'], JSON.stringify(result));
      })

      .build();
  }
}
