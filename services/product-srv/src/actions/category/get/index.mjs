
import { models } from '@sellgar/db';


export default async () => {
  const { Category } = models;

  const result = await Category.findAll({
    order: [
      ['order', 'asc']
    ],
    attributes: ['uuid', 'code', 'name', 'description', 'order'],
  });

  return result.map((category) => category.toJSON());
};
