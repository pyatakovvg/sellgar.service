
import { models } from '@sellgar/db';


export default async () => {
  const { Attribute } = models;

  const result = await Attribute.findAll({
    order: [
      ['order', 'asc']
    ],
    attributes: ['uuid', 'name', 'description', 'categoryUuid', 'order'],
  });

  return result.map((attribute) => attribute.toJSON());
};
