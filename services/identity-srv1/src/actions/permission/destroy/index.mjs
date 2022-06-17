
import { models } from '@sellgar/db';


export default async function(uuid) {
  const { Permission } = models;

  await Permission.destroy({
    where: {
      uuid,
    },
  });
};
