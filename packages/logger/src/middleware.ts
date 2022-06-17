
import { ExtendableContext, Next } from 'koa';

import logger from './logger';


function middleware() {
  return async function(ctx: ExtendableContext, next: Next) {
    const realIP = ctx['ip'];
    const xff = ctx.header['X-Forwarded-For'] || ctx.header['x-forwarded-for'] || ctx.header['X-FORWARDED_FOR'] || null;
    const correlationId = ctx.header['x-mc-correlation-id'];
    const request = ctx['request'];
    const url = request['url'];
    const method = request['method'];

    let requestData = { ...request['body'] };

    if (requestData && (requestData.constructor === Array) && (requestData.length > 10)) {
      requestData = requestData.slice(0, 10);
      requestData.push('...');
    }

    logger.info({ message: `REQUEST [${realIP}][xff: ${xff}] ---> [${method}] "${url}" (${requestData ? JSON.stringify(requestData) : 'null'})`, correlationId });

    await next();

    const response: any = ctx.response;
    const status = response['status'];

    let responseData: any = { ...response['body'] };

    if (response['headers']['content-type'] === 'application/octet-stream') {
      responseData = '...[stream]...';
    }

    if (typeof responseData === 'object' && (Object.keys(responseData).length > 20)) {
      responseData = "...[base64]...";
    }

    switch(status) {
      case 200:
      case 201:
        logger.info({ message: `RESPONSE <--- [${method}] "${url}" ${status} (${responseData ? JSON.stringify(responseData) : 'null'})`, correlationId });
        break;
      default:
        logger.error({ message: `RESPONSE <--- [${method}] "${url}" ${status} (${responseData ? JSON.stringify(responseData) : 'null'})`, correlationId });
    }
  }
}

export default middleware;
