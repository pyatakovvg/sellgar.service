
import { models } from '@sellgar/db';


export default () => async (ctx) => {
  const { Payment } = models;

  const result = await Payment.findAll({
    order: [
      ['order', 'asc']
    ],
    attributes: ['code', 'displayName', 'isUse', 'order'],
  });

  ctx.body = {
    success: true,
    data: result.map((item) => item.toJSON()),
  };
};
