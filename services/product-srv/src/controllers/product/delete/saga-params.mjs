
export default class SagaParams {
  _product = null;
  _gallery = [];
  _modes = [];
  _attrs = [];
  _result = null;

  setGallery(data) {
    this._gallery = data;
  }

  getGallery() {
    return this._gallery;
  }

  setModes(data) {
    this._modes = data;
  }

  getModes() {
    return this._modes;
  }

  setAttributes(data) {
    this._attrs = data;
  }

  getAttributes() {
    return this._attrs;
  }

  getProduct() {
    return this._product;
  }

  setProduct(product) {
    this._product = product;
  }

  getResult() {
    return this._result;
  }

  setResult(data) {
    this._result = data;
  }
}
