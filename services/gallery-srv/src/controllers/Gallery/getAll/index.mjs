
import { models } from '@sellgar/db';


export default () => async (ctx) => {
  const { Gallery } = models;

  const result = await Gallery.findAndCountAll({
    order: [
      ['createdAt', 'desc'],
    ],
    attributes: ['uuid', 'name', 'createdAt'],
  });

  ctx.status = 200;
  ctx.body = {
    success: true,
    data: result['rows'].map((item) => item.toJSON()),
    meta: {
      total: result['count'],
    },
  };
};
