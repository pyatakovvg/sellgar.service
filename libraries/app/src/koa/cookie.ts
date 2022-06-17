
import { Context, Next } from 'koa';


function cookie() {
  return async function(ctx: Context, next: Next) {
    const cookieHeader = ctx?.['headers']?.['cookie']

    if (cookieHeader) {
      const cookies = cookieHeader.split(';');

      ctx.cookie = {};
      cookies.forEach(function (item) {
        const crumbs = item.split('=');

        if (crumbs.length > 1) {
          ctx.cookie[crumbs[0].trim()] = crumbs[1].trim();
        }
      });
    }

    await next();
  }
}

export default cookie;
