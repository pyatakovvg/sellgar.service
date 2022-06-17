
export default class SagaParams {
  _permission = null;

  setPermission(promotions) {
    this._permission = promotions;
  }

  getPermission() {
    return this._permission;
  }
}
