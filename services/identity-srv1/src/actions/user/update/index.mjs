
import { models } from '@sellgar/db';
import { genHash256 } from "@sellgar/utils";


export default async (uuid, data, { useGeneratePassword = true }) => {
  const { User } = models;

  const object = {};

  if (data['login']) {
    object['login'] = data['login'];
  }

  if (data['password']) {
    object['password'] = useGeneratePassword ? genHash256(data['password'], process.env['PASSWORD_SALT']) : data['password'];
  }

  if ( ! Object.keys(object).length) {
    return void 0;
  }

  await User.update(object, {
    where: {
      uuid,
    }
  });
};
