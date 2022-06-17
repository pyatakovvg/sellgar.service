
import { models } from '@sellgar/db';


export default async function(userUuid) {
  const { UserClaims } = models;

  await UserClaims.destroy({
    where: {
      userUuid,
    },
  });
};
