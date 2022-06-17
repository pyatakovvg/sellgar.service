
export default class SagaParams {
  _claim: any;
  _result: any;

  set result(data: any) {
    this._result = data;
  }

  get result(): any {
    return this._result;
  }

  set claim(data: any) {
    this._claim = data;
  }

  get claim(): any {
    return this._claim;
  }
}
