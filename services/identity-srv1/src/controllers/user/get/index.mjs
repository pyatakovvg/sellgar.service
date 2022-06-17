
import { models } from '@sellgar/db';

import userBuilder from "../../../builders/user.mjs";


export default () => async (ctx) => {
  const { User, Role, Permission, Claim } = models;

  const where = {};

  const result = await User.findAll({
    where,
    attributes: ['uuid', 'login', 'createdAt', 'updatedAt'],
    include: [
      {
        model: Role,
        through: {
          attributes: [],
        },
        attributes: ['uuid', 'code', 'displayName'],
        as: 'roles',
        include: [
          {
            model: Permission,
            through: {
              attributes: [],
            },
            attributes: ['uuid', 'code', 'displayName'],
            as: 'permissions',
          }
        ],
      },
      {
        model: Claim,
        through: {
          attributes: ['value'],
        },
        attributes: ['uuid', 'type', 'description'],
        as: 'claims',
      }
    ],
  });

  ctx.body = {
    success: true,
    data: result.map((item) => userBuilder(item.toJSON())),
  };
};
