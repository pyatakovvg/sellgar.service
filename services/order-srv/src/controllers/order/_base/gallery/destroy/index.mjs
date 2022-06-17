
import { models } from "@sellgar/db";


export default async function(products) {
  const { ProductGallery } = models;

  await ProductGallery.destroy({
    where: {
      productUuid: products.map((item) => item['uuid']),
    }
  });
};