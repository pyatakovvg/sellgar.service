
import { models } from '@sellgar/db';


export default async function(uuid) {
  const { Profile } = models;

  await Profile.destroy({
    where: {
      uuid,
    }
  });
}
