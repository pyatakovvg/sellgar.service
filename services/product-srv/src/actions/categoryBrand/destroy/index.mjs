
import { models, Op } from '@sellgar/db';


export default async () => {
  const { CategoryBrand } = models;

  await CategoryBrand.destroy({
    where: {
      categoryUuid: {
        [Op.not]: null,
      },
    },
  });
};
