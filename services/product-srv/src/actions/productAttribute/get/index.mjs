
import { models } from '@sellgar/db';


export default async function(productUuid) {
  const { ProductAttribute } = models;

  const result = await ProductAttribute.findAll({
    where: {
      productUuid,
    },
  });

  return result.map((item) => item.toJSON());
}
