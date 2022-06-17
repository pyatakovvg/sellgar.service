
import { models } from '@sellgar/db';


export default async () => {
  const { GroupCategory } = models;

  const result = await GroupCategory.findAll();

  return result.map((item) => item.toJSON());
};
