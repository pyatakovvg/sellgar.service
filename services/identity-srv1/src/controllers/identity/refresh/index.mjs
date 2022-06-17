
import { models } from '@sellgar/db';
import { token } from "@sellgar/utils";
import { decode, sign } from '@sellgar/jwt';
import {BadRequestError, UnauthorizedError} from '@package/errors';


export default () => async (ctx) => {
  const { RefreshToken } = models;
  const { accessToken, refreshToken } = ctx['request']['body'];

  if ( ! accessToken || ! refreshToken) {
    throw new BadRequestError({ code: '100.1.100', message: 'Отсутствует токен авторизации' });
  }

  const { payload } = decode(accessToken);

  const result = await RefreshToken.findOne({
    where: {
      userUuid: payload['uuid'],
      refreshToken,
    },
  });

  if ( ! result) {
    throw new UnauthorizedError({ code: '20.1.200', message: 'Пользователь не авторизован' });
  }

  const today = Date.now();
  const currentIP = ctx['ips'].length > 0 ? ctx['ips'][ctx['ips'].length - 1] : ctx['ip'];
  const data = result.toJSON();

  if (data['ip'] !== currentIP) {
    throw new UnauthorizedError({ code: '20.1.300', message: 'Конфликт IP адреса' });
  }

  if (data['userAgent'] !== ctx['userAgent']['source']) {
    throw new UnauthorizedError({ code: '20.1.400', message: 'Конфликт user agent' });
  }

  if (Number(today) >= Number(data['expiresIn'])) {
    throw new UnauthorizedError({ code: '20.1.500', message: 'Пользователь не авторизован. Токен отозван' });
  }

  // обновляем токен
  const expirationTime = Number(today + Number(process.env['JWT_EXP'] * 60 * 1000));
  const expirationFullTime = Number(today + Number(process.env['JWT_EXP_END'] * 24 * 60 * 1000));
  const newRefreshToken = token(today + process.env['JWT_SECRET']).digest('hex');

  await RefreshToken.update({
    refreshToken: newRefreshToken,
    expiresIn: expirationFullTime,
  }, {
    where: {
      userUuid: data['userUuid'],
    },
  });

  const newPayload = {
    ...payload,
    exp: parseInt(String(expirationTime / 1000), 10),
  };

  const newAccessToken = sign(newPayload, process.env['JWT_SECRET'], {
    algorithm:  "HS256"
  });

  ctx.status = 200;
  ctx.body = {
    success: true,
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }
  };
};
