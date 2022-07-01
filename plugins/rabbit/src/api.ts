
import logger from '@package/logger';
import { UUID } from '@helper/utils';
import { InternalServerError } from '@package/errors';

import amqp from 'amqplib/callback_api';


function sendMessageToQueue(channel, queue, message, params = {}) {
  channel.sendToQueue(queue, Buffer.from(message), {
    persistent: true,
    ...params,
  });
  logger.info(`RabbitMQ: Сообщение ${JSON.stringify(message)} отправлено в очередь "${queue}"`);
}

export async function createConnection(host) {
  return new Promise(function (resolve, reject) {
    amqp.connect(host, function(error, connection) {
      if (error) {
        return reject(new InternalServerError({ code: '10.0.0', message: error['message'] }));
      }
      logger.info('RabbitMQ: Произведено подключение');
      resolve(connection);
    });
  });
}

export async function createChanel(connection) {
  return new Promise(function(resolve, reject) {
    connection.createChannel(function(error, channel) {
      if (error) {
        return reject(new InternalServerError({ code: '10.1.0', message: error['message'] }));
      }
      logger.info('RabbitMQ: Создан канал для передачи данных');
      resolve(channel);
    });
  });
}

export async function createQueue(channel, queue, message, options) {
  const defaultOptions = {
    reply: false,
    ...options,
  };

  return new Promise(function(resolve, reject) {
    channel.assertQueue(queue, { durable: true, autoDelete: true }, function(error) {
      if (error) {
        return reject(new InternalServerError({ code: '10.2.0', message: error['message'] }));
      }
      logger.info(`RabbitMQ: Очередь "${queue}" успешно создана или существует`);

      const correlationId = UUID();
      const replyQueue = queue + '_reply';

      if (defaultOptions['reply']) {
        channel.assertQueue(replyQueue, { durable: true, autoDelete: true }, function(error) {
          if (error) {
            return reject(new InternalServerError({ code: '10.2.1', message: error['message'] }));
          }

          logger.info(`RabbitMQ: Очередь "${replyQueue}" для обратного вызова успешно добавлена или существует`);

          channel.consume(replyQueue, function(message) {
            if (message['properties']['correlationId'] === correlationId) {
              channel.cancel(message['fields']['consumerTag'], function(error) {
                if (error) {
                  return reject(new InternalServerError({ code: '10.2.2', message: error['message'] }));
                }
                logger.info(`RabbitMQ: Получено подтверждение по очереди "${queue}" "${message['content'].toString()}"`);
                resolve(message.content.toString());
              });
            }
          }, { noAck: true });

          sendMessageToQueue(channel, queue, Buffer.from(message), {
            correlationId,
            replyTo: replyQueue,
          });
          logger.info(`RabbitMQ: Сообщение ${JSON.stringify(message)} отправлено в очередь "${queue}"`);
        });
      }
      else {
        sendMessageToQueue(channel, queue, Buffer.from(message));
        resolve(null);
      }
    });
  });
}

export async function createConsumer(channel, queue, options, callback?) {
  let defaultOptions = {
    reply: false,
  };

  if (options instanceof Function) {
    callback = options;
  }
  else {
    defaultOptions = {
      ...defaultOptions,
      ...options,
    };
  }

  return new Promise(function(resolve, reject) {
    channel.assertQueue(queue, { durable: true, autoDelete: true }, function(error) {
      if (error) {
        return reject(new InternalServerError({ code: '10.3.0', message: error['message'] }));
      }

      logger.info(`RabbitMQ: Очередь "${queue}" успешно создана или существует`);

      channel.prefetch(1);

      channel.consume(queue, function(message) {
        logger.info(`RabbitMQ: Получено сообщение "${message.content.toString()}" в очередь "${queue}"`);

        callback(message.content.toString(), function(isOk, replyMessage) {

          if (defaultOptions['reply']) {
            channel.sendToQueue(message['properties']['replyTo'], Buffer.from(replyMessage), {
              correlationId: message['properties']['correlationId'],
            });

            logger.info(`RabbitMQ: Подтверждениие отправлено в очередь "${message['properties']['replyTo']}"`);
          }

          if (isOk) {
            logger.info(`RabbitMQ: Подтверждениие о получении данных отправлено`);
            channel.ack(message);
          }
          else {
            channel.reject(message, true);
          }
        });
      }, { noAck: false }, function(error) {
        if (error) {
          return reject(new InternalServerError({ code: '10.3.1', message: error['message'] }));
        }
        resolve(null);
      });
    });
  });
}

export async function createExchange(channel, exchange) {
  return new Promise(function(resolve, reject) {
    channel.assertExchange(exchange, 'fanout', { durable: true }, function(error) {
      if (error) {
        return reject(new InternalServerError({ code: '10.4.0', message: error['message'] }));
      }
      logger.info(`RabbitMQ: Exchange "${exchange}" успешно создан или существует`);
      resolve(null);
    })
  });
}

export async function createPublish(channel, exchange, message) {
  await createExchange(channel, exchange);

  channel.publish(exchange, '', Buffer.from(message), { percistent: true });

  logger.info(`RabbitMQ: Сообщение "${message}" успешно отправлено в exchange "${exchange}"`);
}

export async function bindQueueToExchange(channel, queue, exchange) {
  return new Promise(function(resolve, reject) {
    channel.bindQueue(queue, exchange, '', {}, function(error) {
      if (error) {
        return reject(new InternalServerError({ code: '10.5.0', message: error['message'] }));
      }
      logger.info(`RabbitMQ: Очередь "${queue}" успешно привязана к exchange "${exchange}"`);
      resolve(null);
    });
  });
}
