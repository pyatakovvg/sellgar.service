
import { models } from '@sellgar/db';


export default async function(userUuid) {
  const { UserRoles } = models;

  await UserRoles.destroy({
    where: {
      userUuid,
    },
  });
};
