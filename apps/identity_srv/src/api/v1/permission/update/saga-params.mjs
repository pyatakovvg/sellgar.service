
export default class SagaParams {
  _permission = null;
  _result = null;

  setResult(data) {
    this._result = data;
  }

  getResult() {
    return this._result;
  }

  setPermission(promotions) {
    this._permission = promotions;
  }

  getPermission() {
    return this._permission;
  }
}
