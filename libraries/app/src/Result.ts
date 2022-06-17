
interface IDataError {
  code: string;
  message: string;
  correlationId?: string;
}


class Result {
  private result: object = {};

  constructor(state: boolean = true) {
    this.result['success'] = state;
    return this;
  }

  data(data: any) {
    this.result['data'] = data;
    return this;
  }

  error(data: IDataError) {
    this.result['error'] = data;
    return this;
  }

  meta(meta: any) {
    this.result['meta'] = meta;
    return this;
  }

  build(isEmpty: boolean = false) {
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
