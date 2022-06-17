
import { models } from '@sellgar/db';


export default async() => {
  const { Unit } = models;

  const result = await Unit.findAll({
    order: [
      ['order', 'asc']
    ],
    attributes: ['uuid', 'name', 'description'],
  });

  return result.map((unit) => unit.toJSON());
}
