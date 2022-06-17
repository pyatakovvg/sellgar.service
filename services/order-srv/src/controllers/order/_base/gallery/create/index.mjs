
import { models } from "@sellgar/db";


export default async function(orderUuid, products) {
  const { ProductGallery } = models;

  if (products && !! products.length) {
    const productsWithImages = products.filter((item) => !! item['gallery'].length);
    const bulkProducts = productsWithImages.map((item) => ({
      productUuid: item['uuid'],
      imageUuid: item['gallery'][0]['uuid'],
    }));

    await ProductGallery.bulkCreate(bulkProducts);
  }
};