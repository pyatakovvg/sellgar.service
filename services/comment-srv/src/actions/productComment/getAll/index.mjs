
import { models, Op } from '@sellgar/db';


export default async function(params) {
  const { Comment, Theme, Customer } = models;
  const where = {};

  if ('uuid' in where) {
    where[Op.or] = [
      { uuid: params['uuid'] },
      { parentUuid: params['uuid'] },
    ];
  }

  if ('themeUuid' in params) {
    where['themeUuid'] = params['themeUuid'];
  }

  const result = await Comment.findAll({
    where,
    include: [
      {
        model: Theme,
        as: 'theme',
      },
      {
        model: Customer,
        as: 'customer',
      },
    ],
  });

  if ( ! result.length) {
    throw new Error(`The comments are not found`);
  }

  return result.map((item) => item.toJSON());
}
