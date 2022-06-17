
import { models, Op } from '@sellgar/db';


export default async () => {
  const { Unit } = models;

  await Unit.destroy({
    where: {
      uuid: {
        [Op.not]: null,
      },
    },
  });
};
