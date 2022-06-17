
import { models, Op } from '@sellgar/db';


export default async () => {
  const { Brand } = models;

  await Brand.destroy({
    where: {
      uuid: {
        [Op.not]: null,
      },
    },
  });
};
