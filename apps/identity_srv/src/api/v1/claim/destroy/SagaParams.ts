
class SagaParams {
  private _claim = null;

  set claim(data) {
    this._claim = data;
  }

  get claim() {
    return this._claim;
  }
}

export default SagaParams;
