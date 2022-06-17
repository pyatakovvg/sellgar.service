
import { models } from '@sellgar/db';


export default async function(roleUuid) {
  const { RolePermissions } = models;

  const result = await RolePermissions.findAll({
    attributes: ['roleUuid', 'permissionUuid'],
    where: {
      roleUuid,
    }
  });

  return result.map((item) => item.toJSON());
};
