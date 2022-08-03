
import logger from '@package/logger';
import { InternalServerError } from "@package/errors";

import * as Sagas from 'node-sagas';

import { IParams } from './saga-params';
import Product from './product';
import Gallery from './gallery';
import Modes from "./mode";
import Attribute from "./attribute";


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
      console.log(e)
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
    const gallery = new Gallery(this.parent);
    const mode = new Modes(this.parent);
    const attribute = new Attribute(this.parent);


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

        const productData = params.getProduct();
        await product.update(uuid, productData);
      })

      .step('Get gallery')
      .invoke(async(params: IParams) => {
        logger.info('get gallery');

        const result = await gallery.getByProductUuid(uuid);
        params.setGallery(result);
      })
      .withCompensation(async(params: IParams) => {
        logger.info('restore gallery');

        const result = params.getGallery();

        await gallery.destroy(uuid);
        await gallery.create(result.map((item) => ({
          imageUuid: item['imageUuid'],
          productUuid: item['productUuid'],
          order: item['order'],
        })));
      })

      .step('Update gallery')
      .invoke(async() => {
        logger.info('update gallery');

        await gallery.destroy(uuid);
        await gallery.create(body['gallery'].map((item, index) => ({
          imageUuid: item['uuid'],
          productUuid: uuid,
          order: index,
        })));
      })

      .step('Update modes')
      .invoke(async(params: IParams) => {
        logger.info('update modes');

        const result = await mode.getByProductUuid(uuid);
        params.setModes(result);
      })
      .withCompensation(async(params: IParams) => {
        logger.info('restore modes');

        const result = params.getModes();

        await mode.destroy(uuid);
        await mode.create(result.map((item) => ({
          price: item['price'],
          uuid: item['uuid'],
          productUuid: item['productUuid'],
          vendor: item['vendor'],
          value: item['value'],
          currencyCode: item['currencyCode'],
          isUse: item['isUse'],
          isTarget: item['isTarget'],
          order: item['order'],
        })));
      })

      .step('Create modes')
      .invoke(async() => {
        logger.info('create modes');

        await mode.destroy(uuid);
        await mode.create(body['modes'].map((item, index) => ({
          price: item['price'],
          uuid: item['uuid'],
          productUuid: uuid,
          vendor: item['vendor'],
          value: item['value'],
          currencyCode: item['currencyCode'],
          isUse: item['isUse'],
          isTarget: item['isTarget'],
          order: index,
        })));
      })

      .step('Update attributes')
      .invoke(async(params: IParams) => {
        logger.info('update attributes');

        const result = await attribute.getByProductUuid(uuid);
        params.setAttributes(result);
      })
      .withCompensation(async(params: IParams) => {
        logger.info('restore modes');

        const result = params.getAttributes();

        await attribute.destroy(uuid);
        await attribute.create(result.map((item) => ({
          productUuid: item['productUuid'],
          value: item['value'],
          attributeUuid: item['attributeUuid'],
        })));
      })

      .step('Create attributes')
      .invoke(async() => {
        logger.info('create attributes');

        await attribute.destroy(uuid);
        await attribute.create(body['attributes'].map((item) => ({
          productUuid: uuid,
          value: item['value'],
          attributeUuid: item['attributeUuid'],
        })));
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
