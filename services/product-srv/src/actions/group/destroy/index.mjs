
import { models, Op } from '@sellgar/db';


export default async () => {
  const { Group } = models;

  await Group.destroy({
    where: {
      uuid: {
        [Op.not]: null,
      },
    },
  });
};
