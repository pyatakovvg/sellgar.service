
import { models, Op } from '@sellgar/db';


export default async function(uuid) {
  const { Comment } = models;

  await Comment.destroy({
    where: {
      [Op.or]: [
        { uuid: uuid },
        { parentUuid: uuid },
      ],
    },
  });
}
