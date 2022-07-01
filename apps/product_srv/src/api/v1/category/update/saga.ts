
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
    const GroupCategory = db.models['GroupCategory'];

    return sagaBuilder
      .step('Get category')
      .invoke(async (params: IParams) => {
        logger.info('get category');

        const result = await Category.findOne({
          where: {
            uuid: body['uuid'],
          },
          include: [{
            model: Group,
            attributes: ['uuid', 'code', 'name', 'description'],
            as: 'groups',
          }],
        });
        params.setItem(result);
      })
      .step('Update category')
      .invoke(async () => {
        logger.info('update category');

        await Category.update(body, {
          where: {
            uuid: body['uuid'],
          }
        });
      })
      .withCompensation(async (params: IParams) => {
        logger.info('remove category');

        const item = params.getItem();

        await Category.update(item, {
          where: {
            uuid: item['uuid'],
          }
        });
      })

      .step('Create category-group')
      .invoke(async (params: IParams) => {
        logger.info('create category-group');

        if ( ! ('groupUuid' in body)) {
          return void 0;
        }

        const item = params.getItem();
        await GroupCategory.destroy({
          where: {
            categoryUuid: item['uuid'],
          }
        });
        await GroupCategory.bulkCreate([
          {
            groupUuid: body['groupUuid'],
            categoryUuid: item['uuid'],
          }
        ]);
      })
      .withCompensation(async (params: IParams) => {
        logger.info('remove category-group');

        const item = params.getItem();
        await GroupCategory.destroy({
          where: {
            categoryUuid: item['uuid'],
          }
        });
      })

      .step('Get result category')
      .invoke(async (params: IParams) => {
        logger.info('get result category');

        const item = params.getItem();
        const result = await Category.findOne({
          where: {
            uuid: item['uuid'],
          },
          include: [{
            model: Group,
            attributes: ['uuid', 'code', 'name', 'description'],
            as: 'groups',
          }]
        });

        params.setResult(result.toJSON());
      })

      .build();
  }
}
