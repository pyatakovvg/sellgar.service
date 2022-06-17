
import { models } from '@sellgar/db';


export default async function(uuid) {
  const { Comment, Theme, Customer } = models;

  const result = await Comment.findByPk(uuid, {
    include: [
      {
        model: Theme,
        as: 'theme',
      },
      {
        model: Customer,
        as: 'customer',
      },
    ],
  });

  if ( ! result) {
    throw new Error(`The comment is not found`);
  }

  return result.toJSON();
}
