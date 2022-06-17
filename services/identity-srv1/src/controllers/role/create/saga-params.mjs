
export default class SagaParams {
  _role = null;
  _result = null;
  _permissions = [];

  setResult(data) {
    this._result = data;
  }

  getResult() {
    return this._result;
  }

  setRole(data) {
    this._role = data;
  }

  getRole() {
    return this._role;
  }
}
