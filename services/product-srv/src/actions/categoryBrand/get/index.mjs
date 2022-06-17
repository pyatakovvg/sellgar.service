
import { models } from '@sellgar/db';


export default async () => {
  const { CategoryBrand } = models;

  const result = await CategoryBrand.findAll();

  return result.map((item) => item.toJSON());
};
