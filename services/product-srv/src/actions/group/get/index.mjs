
import { models } from '@sellgar/db';


export default async() => {
  const { Group } = models;

  const result = await Group.findAll({
    order: [
      ['order', 'asc']
    ],
    attributes: ['uuid', 'code', 'name', 'description', 'order'],
  });

  return result.map((item) => item.toJSON());
};
