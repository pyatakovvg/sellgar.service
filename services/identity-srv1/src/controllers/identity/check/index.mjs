
import { NetworkError, BadRequestError, ExpiredError } from '@package/errors';
import { verify, TokenExpiredError, JsonWebTokenError } from '@sellgar/jwt';


export default () => async (ctx) => {
  try {
    const { accessToken } = ctx['request']['body'];

    await verify(accessToken, process.env['JWT_SECRET']);

    ctx.body = {
      success: true,
      data: null,
    };
  }
  catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new ExpiredError({ code: '100.0.100', message: 'Время жизни токена истекло 1' });
    }
    else if (error instanceof JsonWebTokenError) {
      throw new BadRequestError({ code: '100.0.150', message: 'Невалидный токен' });
    }

    throw new NetworkError({ code: '100.0.200', message: error['message'] });
  }
};
