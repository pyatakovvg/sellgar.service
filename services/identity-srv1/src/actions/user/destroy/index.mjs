
import { models } from '@sellgar/db';


export default async (uuid) => {
  const { User } = models;

  await User.destroy({
    where: {
      uuid,
    }
  });
};
