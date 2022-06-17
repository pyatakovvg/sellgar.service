
import { NotfoundError } from '@package/errors';

import logger from '@package/logger';
import request from "@package/request";

import nunjucks from 'nunjucks';
import nodeMailer from 'nodemailer';

import userBuilder from './builder/user.mjs';


export default async (data) => {
  const { data: user } = await request({
    url: process.env['IDENTITY_API_SRV'] + '/users',
    method: 'get',
    params: {
      uuid: data['uuid'],
    },
  });

  if ( ! user.length) {
    throw new NotfoundError({ code: '5.6.7', message: 'Пользователь не найден' });
  }

  const userData = userBuilder(user[0]);

  const transporter = nodeMailer.createTransport({
    host: process.env['EMAIL_HOST'],
    port: Number(process.env['EMAIL_PORT']),
    ssl: true,
    tls: false,
    auth: {
      user: process.env['EMAIL_USER'],
      pass: process.env['EMAIL_PASSWORD'],
    }
  });

  const html = nunjucks.render('user/create/index.html', {
    domain: process.env['DOMAIN'],
    ...userData,
  });

  const info = await transporter.sendMail({
    from: "osetpr.ru " + process.env['EMAIL_USER'],
    to: userData['login'],
    subject: `Успешная регистрация на osetpr.ru`,
    html,
    date: new Date(),
  });

  logger['info'](info);
}
