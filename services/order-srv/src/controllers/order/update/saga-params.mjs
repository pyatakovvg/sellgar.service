
export default class SagaParams {
  _order = null;
  _finishOrder = null;
  _customer = null;

  getOrder() {
    return this._order;
  }

  setOrder(order) {
    this._order = order;
  }

  getCustomer() {
    return this._customer;
  }

  setCustomer(customer) {
    this._customer = customer;
  }

  getFinishOrder() {
    return this._finishOrder;
  }

  setFinishOrder(order) {
    this._finishOrder = order;
  }
}
