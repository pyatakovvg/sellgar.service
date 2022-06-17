
import { models } from '@sellgar/db';


export default async() => {
  const {Brand} = models;

  const result = await Brand.findAll({
    order: [
      ['order', 'asc']
    ],
    attributes: ['uuid', 'code', 'name', 'description'],
    where: {},
  });

  return result.map((theme) => theme.toJSON());
}
