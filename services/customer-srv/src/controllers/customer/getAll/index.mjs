
import { models } from '@sellgar/db';

import customerBuilder from '../../../builders/customer.mjs';


export default () => async (ctx) => {
  const where = {};
  let offset = {};
  let options = {};

  const { Customer, Profile } = models;
  const {
    uuid = null,
    limit = null,
    skip = null,
    take = null,
  } = ctx['request']['query'];

  if (uuid) {
    where['uuid'] = uuid;
  }

  if (limit) {
    options['limit'] = Number(limit);
  }

  if (skip && take) {
    offset['offset'] = Number(skip);
    offset['limit'] = Number(take);
  }

  const result = await Customer.findAndCountAll({
    where: { ...where, },
    ...options,
    ...offset,
    distinct: true,
    order: [
      ['createdAt', 'desc'],
    ],
    attributes: ['uuid', 'createdAt', 'updatedAt'],
    include: [
      {
        model: Profile,
        as: 'profile',
      }
    ],
  });

  ctx.body = {
    success: true,
    data: result['rows'].map((customer) => customerBuilder(customer)),
    meta: {
      total: result['count'],
    },
  };
};
