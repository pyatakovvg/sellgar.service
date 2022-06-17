
import { Route, Result, Controller } from '@library/app';

import jwt from 'jsonwebtoken';


@Route('post', '/api/v1/token/refresh')
class CheckController extends Controller {
  async send(): Promise<any> {
    const token =  jwt.sign({
      user: 'Viktor'
    }, process.env['JWT_SECRET'], {
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
