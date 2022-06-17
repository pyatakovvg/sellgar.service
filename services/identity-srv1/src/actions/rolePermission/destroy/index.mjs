
import { models } from '@sellgar/db';


export default async function(roleUuid) {
  const { RolePermissions } = models;

  await RolePermissions.destroy({
    where: {
      roleUuid,
    },
  });
};
