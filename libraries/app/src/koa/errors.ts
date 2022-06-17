
import {
  BaseError,
  NotFoundError,
  MethodNotAllowError,
} from '@package/errors';

import Result from '../Result';


function checkStatus(ctx) {
  if (ctx['status'] === 404) {
    throw new NotFoundError({ code: '100.1.2', message: `Путь "${ctx['request']['url']}" не найден` });
  }
  else if (ctx['status'] === 405) {
    throw new MethodNotAllowError({ code: '100.1.3', message: 'Метод "' + ctx['method'] + '" по пути "' + ctx['url'] + '" не разрешен' });
  }
}

function middleware() {
  return async function (ctx, next) {
    try {
      await next();
      checkStatus(ctx);
    }
    catch (error) {

      if (error instanceof BaseError) {
        ctx.status = error['status'];
        ctx.body = new Result(false)
          .error(error['data'])
          .build();
      }
      else {
        ctx.status = 500;
        ctx.body = new Result(false)
          .error({ code: '100.1.1', message: error['message'] })
          .build();
      }
    }
  }
}

export default middleware;
