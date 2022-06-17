

import logger from '@package/logger';
import { NetworkError } from '@package/errors';

import Sagas from 'node-sagas';

import getAttributes from '../../../actions/attribute/get';
import getAllAttributes from '../../../actions/attribute/getAll';
import createAttributes from '../../../actions/attribute/create';
import destroyAttributes from '../../../actions/attribute/destroy';


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
      .step('Get attributes')
      .invoke(async (params) => {
        logger.info('get attributes');

        const result = await getAttributes();
        params.setAttributes(result);
      })

      .step('Create attributes')
      .invoke(async () => {
        logger.info('create attributes');

        await destroyAttributes();
        await createAttributes(body);
      })
      .withCompensation(async (params) => {
        logger.info('remove attributes');

        const result = params.getAttributes();
        await destroyAttributes();
        await createAttributes(result);
      })

      .step('Get result themes')
      .invoke(async (params) => {
        logger.info('get result attributes');

        const result = await getAllAttributes();
        params.setResult(result);
      })

      .build();
  }
}
