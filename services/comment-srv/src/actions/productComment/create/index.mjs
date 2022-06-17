
import { models } from '@sellgar/db';


export default async function(data) {
  const { Comment } = models;

  const result = await Comment.create(data);

  if ( ! result) {
    throw new Error(`The comment is not created`);
  }

  return result.toJSON();
}
