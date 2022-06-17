
interface IError {
  name: string;
  status: number;
  data: any;
}

interface IData {
  code: string;
  message: string;
}


export class BaseError extends Error implements IError {
  name: string;
  status: number;
  data: IData;

  constructor(status: number, data: IData) {
    super();

    this.name = 'BaseError';
    this.status = status;
    this.data = data;

    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, BaseError);
    }
  }
}


export class BadRequestError extends BaseError {
  constructor(data: IData) {
    super(400, data);

    this.name = 'BadRequestError';

    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, BadRequestError);
    }
  }
}

export class UnauthorizedError extends BaseError {
  constructor(data: IData) {
    super(401, data);

    this.name = 'UnauthorizedError';

    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, UnauthorizedError);
    }
  }
}

export class NotFoundError extends BaseError {
  constructor(data: IData) {
    super(404, data);

    this.name = 'NotFoundError';

    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, NotFoundError);
    }
  }
}

export class MethodNotAllowError extends BaseError {
  constructor(data: IData) {
    super(405, data);

    this.name = 'MethodNotAllowError';

    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, MethodNotAllowError);
    }
  }
}

export class InternalServerError extends BaseError {
  constructor(data: IData) {
    super(500, data);

    this.name = 'InternalServerError';

    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, InternalServerError);
    }
  }
}

export class ServiceUnavailableError extends BaseError {
  constructor(data: IData) {
    super(503, data);

    this.name = 'ServiceUnavailableError';

    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, ServiceUnavailableError);
    }
  }
}
