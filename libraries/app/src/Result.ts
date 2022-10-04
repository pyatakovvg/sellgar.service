
interface IDataError {
  code: string;
  message: string;
  correlationId?: string;
}

interface IResult {
  data?: any;
  meta?: any;
  success?: boolean;
}


class Result {
  private result: IResult = {};

  constructor(state: boolean = true) {
    this.result['success'] = state;
    return this;
  }

  data<T>(data: T): Result {
    this.result['data'] = data;
    return this;
  }

  error(data: IDataError): Result {
    this.result['error'] = data;
    return this;
  }

  meta<T>(meta: T): Result {
    this.result['meta'] = meta;
    return this;
  }

  build(isEmpty: boolean = false): IResult {
    if (isEmpty) {
      return this.result['data'];
    }
    return this.result;
  }

  stream() {
    return this.result['data'];
  }
}

export default Result;
