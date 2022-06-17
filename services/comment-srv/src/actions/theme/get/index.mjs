
import { models } from '@sellgar/db';


export default async function() {
  const { Theme } = models;

  const result = await Theme.findAll({
    order: [
      ['order', 'asc'],
    ],
    attributes: ['uuid', 'name', 'order'],
  });

  if ( ! result.length) {
    throw new Error(`The themes are not found`);
  }

  return result;
}
