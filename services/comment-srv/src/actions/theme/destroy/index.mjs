
import { models, Op } from '@sellgar/db';


export default async function() {
  const { Theme } = models;

  await Theme.destroy({
    where: {
      uuid: {
        [Op.not]: null,
      },
    },
  });
}
