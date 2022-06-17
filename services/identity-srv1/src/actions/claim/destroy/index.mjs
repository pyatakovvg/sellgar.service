
import { models } from '@sellgar/db';


export default async function(uuid) {
  const { Claim } = models;

  await Claim.destroy({
    where: {
      uuid,
    },
  });
};
