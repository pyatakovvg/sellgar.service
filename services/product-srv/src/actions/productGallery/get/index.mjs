
import { models } from '@sellgar/db';


export default async function(productUuid) {
  const { ProductGallery } = models;

  const result = await ProductGallery.findAll({
    where: {
      productUuid,
    },
  });

  return result.map((item) => item.toJSON());
}
