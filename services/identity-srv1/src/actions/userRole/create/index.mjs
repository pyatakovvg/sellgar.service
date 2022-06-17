
import { models } from '@sellgar/db';


export default async function(userUuid, roles) {
  const { UserRoles } = models;

  return UserRoles.bulkCreate(roles.map((roleUuid) => ({
    roleUuid,
    userUuid,
  })));
};
