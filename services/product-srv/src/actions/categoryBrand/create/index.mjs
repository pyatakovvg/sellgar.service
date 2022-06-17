
import { models } from '@sellgar/db';


export default async function(data) {
  const { CategoryBrand } = models;
console.log(data)
  const result = await CategoryBrand.bulkCreate(data.map((item) => ({
    categoryUuid: item['categoryUuid'],
    brandUuid: item['brandUuid'],
  })), {
    returning: true,
  });

  if ( !! data.length && ! result.length) {
    throw new Error(`The category-brand are not created`);
  }

  return result.map((item) => item.toJSON());
}
