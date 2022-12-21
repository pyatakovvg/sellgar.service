
import moment from '@package/moment';

import winston from 'winston';
import { ExtendableContext, Next } from 'koa';


const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = (env === 'development');
  return isDevelopment ? 'debug' : 'warn';
};

const colors = {
  info: 'bold blue',
  warn: 'italic yellow',
  error: 'bold red',
  debug: 'green'
};

function protectedProcess(message) {
  return message
    .replace(/"password":"(.*)"/ig, '"password":"******"');
}

function timezone() {
  return moment().utc().format('YYYY-MM-DD HH:mm:ss.SSS +00:00');
}

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.colorize({ level: true }),
  winston.format.timestamp({ format: timezone }),
  winston.format.printf((info) => {
    return `{"@t": "${info['timestamp']}", "@l": "${info['level']}", "@m": ${JSON.stringify(protectedProcess(info['message']))}}`;
  }),
);

const transports = [
  new winston.transports.Console(),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default logger;

export function middleware() {
  return async function(ctx: ExtendableContext, next: Next) {
    const realIP = ctx['ip'];
    const xff = ctx.header['X-Forwarded-For'] || ctx.header['x-forwarded-for'] || ctx.header['X-FORWARDED_FOR'] || null;
    const correlationId = ctx.header['x-mc-correlation-id'];
    const request = ctx['request'];
    const url = request['url'];
    const method = request['method'];
    let body;

    if (request['body'] instanceof Array) {
      body = [...request.body] as Array<any>;
      if (body.length > 10) {
        body = body.slice(0, 10);
        body.push('...');
      }
    }
    else if (request['body'] instanceof Object) {
      body = { ...request.body } as object;
    }

    logger.info({ message: `REQUEST [${realIP}][xff: ${xff}] ---> [${method}] "${url}" (${body ? JSON.stringify(body) : 'null'})`, correlationId });

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
      case 204:
        logger.info({ message: `RESPONSE <--- [${method}] "${url}" ${status} (${responseData ? JSON.stringify(responseData) : 'null'})`, correlationId });
        break;
      default:
        logger.error({ message: `RESPONSE <--- [${method}] "${url}" ${status} (${responseData ? JSON.stringify(responseData) : 'null'})`, correlationId });
    }
  }
}
