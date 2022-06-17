
import { models } from '@sellgar/db';

import roleBuilder from "../../../builders/role.mjs";


export default () => async (ctx) => {
  const { Role, Permission } = models;

  const result = await Role.findAll({
    attributes: ['uuid', 'code', 'displayName'],
    include: [
      {
        model: Permission,
        through: {
          attributes: [],
        },
        as: 'permissions',
      }
    ]
  });

  ctx.body = {
    success: true,
    data: result.map((item) => roleBuilder(item.toJSON())),
  };
};
