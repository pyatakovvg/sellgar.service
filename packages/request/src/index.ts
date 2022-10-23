
import logger from '@package/logger';
import {
  BaseError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
  ServiceUnavailableError
} from '@package/errors';

import qs from 'qs';
import axios from 'axios';


const defaultOptions = {
  method: 'get',
  url: '/',
  responseType: 'json',
  withCredentials: false,
};


const requestLogger = (config) => {
  let requestData = null;
  const { url, method, params = null, data = null } = config;

  if (params) {
    requestData = JSON.stringify(params);
  }

  if (data) {
    requestData = JSON.stringify(config['data']);
  }

  logger['info'](`[${method.toLocaleUpperCase()}] ---> "${url}" (${requestData})`);

  return config;
};

const responseLogger = (response) => {
  let responseData = null;
  const { config: { url, method, responseType }, status, data = null } = response;

  if (responseType === 'json' && data) {
    responseData = JSON.stringify(data);
  }

  logger['info'](`[${method.toLocaleUpperCase()}] <--- "${url}" [${status}] (${responseData})`);

  return response;
};

const errorLogger = (error) => {
  let status = 0;
  let data = null;
  const { config: { url, method, responseType }, response } = error;

  if (response) {
    status = response['status'];
    if ('data' in response) {
      if (responseType === 'stream') {
        data = 'stream';
      }
      else {
        data = JSON.stringify(response.data);
      }
    }
  }

  logger['error'](`[${method.toLocaleUpperCase()}] <--- "${url}" [${status}] (${data})`);

  if ('errno' in error) {
    if (error['code'] === 'ECONNREFUSED') {
      return Promise.reject(new BaseError(500, { code: '0.0.0', message: 'Сервис временно недоступен' }));
    }
  }

  if (response) {
    if (response['status'] === 400) {
      return Promise.reject(new BadRequestError(response['data']['error']));
    }
    else if (response['status'] === 401) {
      return Promise.reject(new UnauthorizedError(response['data']['error']));
    }
    else if (response['status'] === 404) {
      return Promise.reject(new NotFoundError(response['data']['error']));
    }
    else if (response['status'] === 500) {
      return Promise.reject(new InternalServerError(response['data']['error']));
    }
    else if (response['status'] === 503) {
      return Promise.reject(new ServiceUnavailableError(response['data']['error']));
    }
    else {
      return Promise.reject(new BaseError(500, response['data']['error']));
    }
  }
};


const request = async (options) => {
  const instance = axios.create({
    ...defaultOptions,
    ...options,
    timeout: 24000,
  });

  instance.interceptors.request.use(function (config) {
    config.paramsSerializer = (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
    return config;
  });
  instance.interceptors.request.use(requestLogger, errorLogger);
  instance.interceptors.response.use(responseLogger, errorLogger);

  const result = await instance(options);

  return result['data'];
};

export default request;
