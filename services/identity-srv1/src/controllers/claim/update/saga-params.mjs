
export default class SagaParams {
  _claim = null;
  _result = null;

  setResult(data) {
    this._result = data;
  }

  getResult() {
    return this._result;
  }

  setClaim(data) {
    this._claim = data;
  }

  getClaim() {
    return this._claim;
  }
}
