
import {
  createConnection,
  createChanel,

  createQueue,
  createConsumer,

  createPublish,
  createExchange,
  bindQueueToExchange,
} from './api.mjs';


let rabbitConnection = null;
let rabbitChannel = null;

export async function connection(host) {
  rabbitConnection = await createConnection(host);
  rabbitChannel = await createChanel(rabbitConnection);
}

export async function sendCommand(queue, message, params) {
  return await createQueue(rabbitChannel, queue, message, params);
}

export async function consumer(queue, options, callback) {
  await createConsumer(rabbitChannel, queue, options, callback);
}

export async function sendEvent(exchange, message) {
  await createExchange(rabbitChannel, exchange);
  await createPublish(rabbitChannel, exchange, message);
}

export async function bindToExchange(queue, exchange, callback) {
  await createExchange(rabbitChannel, exchange);
  await createConsumer(rabbitChannel, queue, callback);
  await bindQueueToExchange(rabbitChannel, queue, exchange);
}
