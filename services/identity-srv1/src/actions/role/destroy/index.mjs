
import { models } from '@sellgar/db';


export default async function(uuid) {
  const { Role } = models;

  await Role.destroy({
    where: {
      uuid,
    },
  });
};
