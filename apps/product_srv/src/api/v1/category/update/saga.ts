
import logger from '@package/logger';
import { InternalServerError } from '@package/errors';

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
        throw new InternalServerError({ code: '100.0.1', message: e['message'] });
      }
    }
  }

  async getSagaDefinition(): Promise<any> {
    const body = this.parent.body;
    const db = this.parent.plugin.get('db');
    const sagaBuilder = new Sagas.SagaBuilder();

    const Group = db.models['Group'];
    const Category = db.models['Category'];

    return sagaBuilder
      .step('Get category')
      .invoke(async (params: IParams) => {
        logger.info('get category');

        const result = await Category.findOne({
          where: {
            code: body['code'],
          },
          include: [{
            model: Group,
            attributes: ['code', 'code', 'name', 'description'],
            as: 'group',
          }],
        });
        params.setItem(result);
      })
      .step('Update category')
      .invoke(async () => {
        logger.info('update category');

        await Category.update(body, {
          where: {
            code: body['code'],
          }
        });
      })
      .withCompensation(async (params: IParams) => {
        logger.info('remove category');

        const item = params.getItem();

        await Category.update(item, {
          where: {
            code: item['code'],
          }
        });
      })

      .step('Get result category')
      .invoke(async (params: IParams) => {
        logger.info('get result category');

        const item = params.getItem();
        const result = await Category.findOne({
          where: {
            code: item['code'],
          },
          include: [{
            model: Group,
            attributes: ['code', 'name', 'description'],
            as: 'group',
          }]
        });

        params.setResult(result.toJSON());
      })

      .build();
  }
}
