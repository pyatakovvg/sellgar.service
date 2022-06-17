
import { models } from '@sellgar/db';


export default async() => {
  const { Attribute, Category, Unit } = models;

  const result = await Attribute.findAll({
    order: [
      ['order', 'asc']
    ],
    attributes: ['uuid', 'name', 'description'],
    include: [
      {
        model: Category,
        as: 'category',
      },
      {
        model: Unit,
        as: 'unit',
      }
    ]
  });

  return result.map((attribute) => attribute.toJSON());
}
