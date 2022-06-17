
import { models } from '@sellgar/db';


export default async function(data) {
  const { GroupCategory } = models;

  const result = await GroupCategory.bulkCreate(data.map((item) => ({
    groupUuid: item['groupUuid'],
    categoryUuid: item['categoryUuid'],
  })), {
    returning: true,
  });

  if ( !! data.length && ! result.length) {
    throw new Error(`The group-category are not created`);
  }

  return result.map((item) => item.toJSON());
}
