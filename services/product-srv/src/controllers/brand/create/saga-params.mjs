
export default class SagaParams {
  _brand = null;
  _result = null;

  setResult(data) {
    this._result = data;
  }

  getResult() {
    return this._result;
  }

  setBrands(data) {
    this._brand = data;
  }

  getBrands() {
    return this._brand;
  }
}
