
import { models } from '@sellgar/db';
import { genHash256 } from "@sellgar/utils";


export default async (data, { useGeneratePassword = true }) => {
  const { User } = models;
  const hashPassword = useGeneratePassword ? genHash256(data['password'], process.env['PASSWORD_SALT']) : data['password'];

  const object = {
    login: data['login'],
    password: hashPassword,
  };

  if (data['uuid']) {
    object['uuid'] = data['uuid'];
  }

  if (data['createdAt']) {
    object['createdAt'] = data['createdAt'];
  }

  if (data['updatedAt']) {
    object['updatedAt'] = data['updatedAt'];
  }

  const result = await User.create(object);

  if ( ! result) {
    throw new Error(`The user is not created`);
  }

  return result.toJSON();
};
