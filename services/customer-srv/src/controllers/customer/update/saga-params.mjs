
export default class SagaParams {
  _customer = null;
  _profile = null;
  _result = null;

  setResult(data) {
    this._result = data;
  }

  getResult() {
    return this._result;
  }

  setCustomer(data) {
    this._customer = data;
  }

  getCustomer() {
    return this._customer;
  }

  setProfile(data) {
    this._profile = data;
  }

  getProfile() {
    return this._profile;
  }
}
