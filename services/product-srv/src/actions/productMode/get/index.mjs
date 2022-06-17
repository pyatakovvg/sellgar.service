
import { models } from '@sellgar/db';


export default async function(productUuid) {
  const { ProductMode } = models;

  const result = await ProductMode.findAll({
    where: {
      productUuid,
    },
  });

  return result.map((item) => item.toJSON());
}
