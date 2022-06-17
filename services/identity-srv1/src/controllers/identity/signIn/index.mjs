
import { NotfoundError } from '@package/errors';

import { sign } from '@sellgar/jwt';
import { models, sequelize } from '@sellgar/db';
import { genHash256, token } from '@sellgar/utils';

import userBuilder from '../../../builders/userModify.mjs';


export default () => async (ctx) => {
  const { User, Role, Permission, Claim, RefreshToken } = models;
  const { login, password } = ctx['request']['body'];

  const hashPassword = genHash256(password, process.env['PASSWORD_SALT']);

  const hasUser = await User.count({
    where: { login, password: hashPassword },
  });

  if ( ! hasUser) {
    throw new NotfoundError({ code: '3.3.3', message: 'Неверный логин или пароль' });
  }

  const transaction = await sequelize.transaction();

  const user = await User.findOne({
    attributes: ['uuid', 'login', 'createdAt', 'updatedAt'],
    where: {
      login,
      password: hashPassword
    },
    include: [
      {
        model: Role,
        through: {
          attributes: [],
        },
        attributes: ['uuid', 'code', 'displayName'],
        as: 'roles',
        include: [
          {
            model: Permission,
            through: {
              attributes: [],
            },
            attributes: ['uuid', 'code', 'displayName'],
            as: 'permissions',
          }
        ],
      },
      {
        model: Claim,
        through: {
          attributes: ['value'],
        },
        attributes: ['uuid', 'type', 'description'],
        as: 'claims',
      }
    ],
    transaction,
  });

  const foundUser = userBuilder(user.toJSON());

  // создаем токен для обновления
  const today = Date.now();
  const expirationTime = Number(today + Number(process.env['JWT_EXP'] * 60 * 1000));
  const expirationFullTime = Number(today + Number(process.env['JWT_EXP_END'] * 24 * 60 * 1000));
  const refreshToken = token(today + process.env['JWT_SECRET']).digest('hex');

  const currentIP = ctx['ips'].length > 0 ? ctx['ips'][ctx['ips'].length - 1] : ctx['ip'];

  await RefreshToken.destroy({
    where: {
      userUuid: foundUser['uuid'],
    },
    transaction,
  });

  await RefreshToken.create({
    userUuid: foundUser['uuid'],
    refreshToken: refreshToken,
    userAgent: ctx['userAgent']['source'],
    ip: currentIP,
    expiresIn: expirationFullTime,
  }, {
    transaction,
  });

  await transaction.commit();

  // организуем авторизационный объект
  const payload = {
    ...foundUser,
    exp: parseInt(String(expirationTime / 1000), 10),
  };

  const identityToken = sign(payload, process.env['JWT_SECRET']);

  ctx.body = {
    success: true,
    data: {
      accessToken: identityToken,
      refreshToken: refreshToken,
    }
  };
};
