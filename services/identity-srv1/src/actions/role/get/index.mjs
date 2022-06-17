
import { models } from '@sellgar/db';


export default async function(uuid) {
  const { Role, Permission } = models;

  const result = await Role.findByPk(uuid, {
    attributes: ['uuid', 'code', 'displayName'],
    include: [
      {
        model: Permission,
        through: {
          attributes: [],
        },
        as: 'permissions',
      }
    ],
  });

  if ( ! result) {
    throw new Error(`The role '${uuid}' is not found`);
  }

  return result.toJSON();
};
