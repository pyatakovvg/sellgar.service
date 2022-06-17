
import logger from '@package/logger';
// import { sendEvent } from '@sellgar/rabbit';
import { InternalServerError } from "@package/errors";

import * as Sagas from 'node-sagas';

import { IParams } from './saga-params';
import Product from './product';
import Gallery from './gallery';
import Modes from "./mode";
import Attribute from "./attribute";

// import getProduct from '../../../actions/product/get';
// import getAllProduct from '../../../actions/product/getAll';
// import updateProduct from '../../../actions/product/update';
//
// import getModes from '../../../actions/productMode/get';
// import createModes from '../../../actions/productMode/create';
// import destroyModes from '../../../actions/productMode/destroy';
//
// import getGallery from '../../../actions/productGallery/get';
// import createGallery from '../../../actions/productGallery/create';
// import destroyGallery from '../../../actions/productGallery/destroy';
//
// import getAttributes from '../../../actions/productAttribute/get';
// import createAttributes from '../../../actions/productAttribute/create';
// import destroyAttributes from '../../../actions/productAttribute/destroy';


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

    const { uuid } = this.parent['params'];
    const body = this.parent['body'];

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

        const product = params.getProduct();
        await product.update(uuid, product);
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
        console.log(result)
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

      // .step('Update attributes')
      // .invoke(async(params) => {
      //   logger.info('update attributes');
      //
      //   const attrs = await getAttributes(uuid);
      //
      //   await destroyAttributes(uuid);
      //   await createAttributes(uuid, body['attributes']);
      //
      //   params.setAttributes(attrs);
      // })
      // .withCompensation(async(params) => {
      //   logger.info('restore attributes');
      //
      //   const attrs = params.getAttributes();
      //
      //   await destroyAttributes(uuid);
      //   await createAttributes(uuid, attrs.map((attr) => ({
      //     value: attr['value'],
      //     uuid: attr['attributeUuid'],
      //   })));
      // })

      .step('Get result product')
      .invoke(async (params: IParams) => {
        logger.info('get result product');

        const result = await product.getByUuid(uuid);
        params.setResult(result);
      })

      // .step('Send event')
      // .invoke(async (params) => {
      //   logger.debug('send event result product');
      //
      //   const result = params.getResult();
      //   await sendEvent(process.env['EXCHANGE_PRODUCT_UPDATE'], JSON.stringify(result));
      // })

      .build();
  }
}
