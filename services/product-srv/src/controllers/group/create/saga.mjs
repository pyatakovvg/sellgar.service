
import { NetworkError } from '@package/errors';

import logger from '@package/logger';

import Sagas from 'node-sagas';

import getGroups from '../../../actions/group/get';
import getAllGroups from '../../../actions/group/getAll';
import createGroups from '../../../actions/group/create';
import destroyGroups from '../../../actions/group/destroy';

import getGroupCategory from '../../../actions/groupCategory/get';
import createGroupCategory from '../../../actions/groupCategory/create';
import destroyGroupCategory from '../../../actions/groupCategory/destroy';


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
      .step('Get groups')
      .invoke(async (params) => {
        logger.info('get groups');

        const result = await getGroups();
        params.setGroups(result);
      })

      .step('Create groups')
      .invoke(async () => {
        logger.info('create groups');

        await destroyGroups();
        await createGroups(body);
      })
      .withCompensation(async(params) => {
        logger.info('remove groups');

        const groups = params.getGroups();
        await destroyGroups();
        await createGroups(groups);
      })

      .step('Get group-category')
      .invoke(async (params) => {
        logger.info('get group-category');

        const result = await getGroupCategory();
        params.setGroupCategory(result);
      })

      .step('Create group-category')
      .invoke(async () => {
        logger.info('create group-category');

        const data = body.reduce((accum, group) => {
          if (group['categories']) {
            const categories = group['categories'].map((category) => ({
              groupUuid: group['uuid'],
              categoryUuid: category,
            }));
            accum.push(...categories);
          }
          return accum;
        }, []);
        await destroyGroupCategory();
        await createGroupCategory(data);
      })
      .withCompensation(async(params) => {
        logger.info('remove group-category');

        const groups = params.getGroupCategory();
        await destroyGroupCategory();
        await createGroupCategory(groups);
      })

      .step('Get result groups')
      .invoke(async (params) => {
        logger.info('get result groups');
        const includeAt = (include instanceof Array) ? include : [include];

        const result = await getAllGroups(includeAt);
        params.setResult(result);
      })

      .build();
  }
}
