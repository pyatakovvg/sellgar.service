
export default class SagaParams {
  _user = null;
  _result = null;

  setResult(data) {
    this._result = data;
  }

  getResult() {
    return this._result;
  }

  setUser(data) {
    this._user = data;
  }

  getUser() {
    return this._user;
  }
}
