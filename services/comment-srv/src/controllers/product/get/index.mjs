
import { models } from '@sellgar/db';

import commentBuilder from '../../../_builders/comment.mjs';


export default () => async (ctx) => {
  const {
    uuid = null,
    limit = null,
    skip = null,
    take = null,
  } = ctx['query'];

  const { Product, Comment, Theme } = models;

  let where = {};
  let offset = {};
  let options = {};

  if (uuid) {
    where['productUuid'] = (uuid instanceof Array) ? uuid : [uuid];
  }

  if (limit) {
    options['limit'] = Number(limit);
  }

  if (skip && take) {
    offset['offset'] = Number(skip);
    offset['limit'] = Number(take);
  }

  const result = await Comment.findAndCountAll({
    ...options,
    ...offset,
    distinct: true,
    order: [
      ['comments', 'createdAt', 'desc'],
    ],
    include: [
      {
        model: Product,
        required: true,
        through: {
          where,
        },
        as: 'products',
      },
      {
        model: Theme,
        as: 'theme',
      },
      {
        model: Comment,
        as: 'comments',
        include: [
          {
            model: Comment,
            as: 'comments',
            include: [
              {
                model: Comment,
                as: 'comments',
              },
            ]
          },
        ]
      }
    ],
  });

  ctx.body = {
    success: true,
    data: result['rows'].map((product) => commentBuilder(product.toJSON())),
    meta: {
      total: result['count'],
    },
  };
};
