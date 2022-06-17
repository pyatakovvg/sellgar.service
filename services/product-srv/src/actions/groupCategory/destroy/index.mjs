
import { models, Op } from '@sellgar/db';


export default async () => {
  const { GroupCategory } = models;

  await GroupCategory.destroy({
    where: {
      groupUuid: {
        [Op.not]: null,
      },
    },
  });
};
