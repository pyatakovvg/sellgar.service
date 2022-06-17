
import winston from 'winston';


const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
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

winston.addColors(colors)

const format = winston.format.combine(
  winston.format.colorize({ level: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss Z' }),
  winston.format.printf((info) => {
    return `{"@t": "${info['timestamp']}", "@l": "${info['level']}", "@m": ${JSON.stringify(protectedProcess(info['message']))}}`;
  }),
);

const transports = [
  new winston.transports.Console(),
];

export default winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});
