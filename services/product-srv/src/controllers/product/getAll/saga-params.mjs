
export default class SagaParams {
  _result = null;

  getResult() {
    return this._result;
  }

  setResult(data) {
    this._result = data;
  }
}
