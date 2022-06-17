
import { NetworkError } from '@package/errors';

import logger from '@package/logger';

import Sagas from 'node-sagas';

import getCategories from '../../../actions/category/get';
import getAllCategories from '../../../actions/category/getAll';
import createCategories from '../../../actions/category/create';
import destroyCategories from '../../../actions/category/destroy';

import getCategoryBrand from "../../../actions/categoryBrand/get/index.mjs";
import destroyCategoryBrand from "../../../actions/categoryBrand/destroy/index.mjs";
import createCategoryBrand from "../../../actions/categoryBrand/create/index.mjs";


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
    const { include } = this.ctx['request']['query'];

    return sagaBuilder
      .step('Get categories')
      .invoke(async (params) => {
        logger.info('get categories');

        const result = await getCategories();
        params.setCategories(result);
      })

      .step('Create categories')
      .invoke(async () => {
        logger.info('create categories');

        await destroyCategories();
        await createCategories(body);
      })
      .withCompensation(async (params) => {
        logger.info('remove categories');

        const categories = params.getCategories();
        await destroyCategories();
        await createCategories(categories);
      })

      .step('Get category-brand')
      .invoke(async (params) => {
        logger.info('get category-brand');

        const result = await getCategoryBrand();
        params.setCategoryBrand(result);
      })

      .step('Create category-brand')
      .invoke(async () => {
        logger.info('create category-brand');

        const data = body.reduce((accum, category) => {
          if (category['brands']) {
            const brands = category['brands'].map((uuid) => ({
              brandUuid: uuid,
              categoryUuid: category['uuid'],
            }));
            accum.push(...brands);
          }
          return accum;
        }, []);
        await destroyCategoryBrand();
        await createCategoryBrand(data);
      })
      .withCompensation(async(params) => {
        logger.info('remove group-category');

        const categoryBrand = params.getCategoryBrand();
        await destroyCategoryBrand();
        await createCategoryBrand(categoryBrand);
      })

      .step('Get result themes')
      .invoke(async (params) => {
        logger.info('get result categories');
        const includeAt = (include instanceof Array) ? include : [include];

        const result = await getAllCategories(includeAt);
        params.setResult(result);
      })

      .build();
  }
}
