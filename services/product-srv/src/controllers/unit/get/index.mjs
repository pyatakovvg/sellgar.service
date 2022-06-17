
import { models } from '@sellgar/db';

import unitBuilder from '../../../_builders/unit.mjs';


export default () => async (ctx) => {
  const { Unit } = models;

  const result = await Unit.findAll({
    order: [
      ['order', 'asc']
    ],
    attributes: ['uuid', 'name', 'description'],
  });

  ctx.body = {
    success: true,
    data: result.map((item) => unitBuilder(item.toJSON())),
  };
};
