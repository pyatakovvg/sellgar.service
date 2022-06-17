
import { models, Op } from '@sellgar/db';


export default async () => {
  const { Category } = models;

  await Category.destroy({
    where: {
      uuid: {
        [Op.not]: null,
      },
    },
  });
};
