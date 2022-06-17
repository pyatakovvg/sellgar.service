
import {models, Op, sequelize} from '@sellgar/db';


export default () => async (ctx) => {
  const { Payment } = models;

  const data = ctx['request']['body'];

  const transaction = await sequelize.transaction();

  await Payment.destroy({
    where: {
      [Op.not]: {
        code: null,
      },
    },
    transaction,
  });

  await Payment.bulkCreate(data['bulk'], {
    transaction,
  });

  await transaction.commit();

  const result = await Payment.findAll({
    order: [
      ['order', 'asc']
    ],
    attributes: ['code', 'displayName', 'isUse', 'order'],
  });

  ctx.body = {
    success: true,
    data: result.map(i => i.toJSON()),
  };
};
