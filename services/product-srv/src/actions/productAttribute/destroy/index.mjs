
import { models } from '@sellgar/db';


export default async function(productUuid) {
  const { ProductAttribute } = models;

  await ProductAttribute.destroy({
    where: {
      productUuid,
    },
  });
}
