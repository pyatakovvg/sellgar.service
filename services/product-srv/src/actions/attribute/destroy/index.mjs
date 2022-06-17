
import { models, Op } from '@sellgar/db';


export default async () => {
  const { Attribute } = models;

  await Attribute.destroy({
    where: {
      uuid: {
        [Op.not]: null,
      },
    },
  });
};
