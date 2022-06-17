
import { models } from '@sellgar/db';


export default async (uuid) => {
  const { User, Role, Permission, Claim } = models;

  const result = await User.findByPk(uuid, {
    attributes: ['uuid', 'login', 'password', 'createdAt', 'updatedAt'],
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

  if ( ! result) {
    throw new Error(`The user '${uuid}' is not found`);
  }

  return result.toJSON();
};
