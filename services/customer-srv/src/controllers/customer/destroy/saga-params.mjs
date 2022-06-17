
export default class SagaParams {
  _customer = null;

  setCustomer(data) {
    this._customer = data;
  }

  getCustomer() {
    return this._customer;
  }
}
