
import { genHash256 } from '@helper/utils';
import { Route, Result, Controller } from '@library/app';
import { NotFoundError, BadRequestError } from "@package/errors";

import jwt from 'jsonwebtoken';

import userBuilder from './builders/user';


interface IBody {
  login: string;
  password: string;
}


@Route('post', '/api/v1/auth/token')
class CheckController extends Controller {
  async send(): Promise<any> {
    const db = super.plugin.get('db');
    const { login, password }: IBody = super.body;

    if ( ! login || ! password) {
      throw new BadRequestError({ code: '100.3.4', message: 'Неверный формат данных' });
    }

    const User = db.models['User'];
    const Role = db.models['Role'];
    const Claim = db.models['Claim'];
    const Permission = db.models['Permission'];

    const hashPassword = genHash256(password, process.env['PASSWORD_SALT']);
    console.log(hashPassword)
    const hasUser = await User.count({
      where: { login, password: hashPassword },
    });

    if ( ! hasUser) {
      throw new NotFoundError({ code: '100.3.3', message: 'Неверный логин или пароль' });
    }

    const result = await User.findOne({
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
    });

    const user = userBuilder(result.toJSON());
    const token =  jwt.sign(user, process.env['JWT_SECRET'], {
      algorithm:  "HS384",
    });

    return new Result(true)
      .data({
        "access_token": token,
        "token_type": "Bearer",
        "expires_in": Date.now() + 30000,
      })
      .build();
  }
}

export default CheckController;
