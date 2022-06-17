
export default class SagaParams {
  _result = null;

  setResult(data) {
    this._result = data;
  }

  getResult() {
    return this._result;
  }
}
