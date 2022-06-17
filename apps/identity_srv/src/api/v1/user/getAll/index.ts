
import { Route, Result, Controller } from '@library/app';

import userBuilder from './builders/user';


@Route('get', '/api/v1/users')
class CheckController extends Controller {
  async send(): Promise<any> {
    const db = super.plugin.get('db');

    const User = db.models['User'];
    const Role = db.models['Role'];
    const Claim = db.models['Claim'];
    const Permission = db.models['Permission'];

    const result = await User.findAll({
      attributes: ['uuid', 'login', 'createdAt', 'updatedAt'],
      where: {},
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

    const users = result.map((item) => userBuilder(item.toJSON()));

    return new Result(true)
      .data(users)
      .build();
  }
}

export default CheckController;
