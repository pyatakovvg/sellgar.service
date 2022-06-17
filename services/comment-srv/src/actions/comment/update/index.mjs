
import { models } from '@sellgar/db';


export default async function update(uuid, data) {
  const { Comment } = models;

  const object = {};

  if ('message' in data) {
    object['message'] = data['message'];
  }

  if ('customerUuid' in data) {
    object['customerUuid'] = data['customerUuid'];
  }

  if ('themeUuid' in data) {
    object['themeUuid'] = data['themeUuid'];
  }

  if ('isAdmin' in data) {
    object['isAdmin'] = data['isAdmin'];
  }

  if ('createdAt' in data) {
    object['createdAt'] = data['createdAt'];
  }

  if ('updatedAt' in data) {
    object['updatedAt'] = data['updatedAt'];
  }

  await Comment.update(object, {
    where: {
      uuid,
    },
  });
}
