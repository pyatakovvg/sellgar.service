
import { models } from '@sellgar/db';


export default async function(roleUuid, permissions) {
  const { RolePermissions } = models;

  await RolePermissions.bulkCreate(permissions.map((uuid) => ({
    roleUuid,
    permissionUuid: uuid,
  })));
};
