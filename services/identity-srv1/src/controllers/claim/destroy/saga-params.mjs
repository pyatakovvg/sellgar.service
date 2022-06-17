
export default class SagaParams {
  _claim = null;

  setClaim(data) {
    this._claim = data;
  }

  getClaim() {
    return this._claim;
  }
}
