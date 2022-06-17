
import { NetworkError } from '@package/errors';

import logger from '@package/logger';

import Sagas from 'node-sagas';

import getBrands from '../../../actions/brand/get';
import getAllBrands from '../../../actions/brand/getAll';
import createBrands from '../../../actions/brand/create';
import destroyBrands from '../../../actions/brand/destroy';


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
      .step('Get brands')
      .invoke(async (params) => {
        logger.info('get brands');

        const result = await getBrands();
        params.setBrands(result);
      })

      .step('Create brands')
      .invoke(async () => {
        logger.info('create brands');

        await destroyBrands();
        await createBrands(body);
      })
      .withCompensation(async(params) => {
        logger.info('remove brands');

        const brands = params.getBrands();
        await destroyBrands();
        await createBrands(brands);
      })

      .step('Get result brands')
      .invoke(async (params) => {
        logger.info('get result brands');

        const result = await getAllBrands();
        params.setResult(result);
      })

      .build();
  }
}
