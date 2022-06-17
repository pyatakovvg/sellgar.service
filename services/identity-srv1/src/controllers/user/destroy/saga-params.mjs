
export default class SagaParams {
  _user = null;

  setUser(promotions) {
    this._user = promotions;
  }

  getUser() {
    return this._user;
  }
}
