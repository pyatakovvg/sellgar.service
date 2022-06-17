
export default class SagaParams {
  _product = null;
  _modes = [];
  _gallery = [];
  _attributes = [];
  _result = null;

  getProduct() {
    return this._product;
  }

  setProduct(data) {
    this._product = data;
  }

  getProductGallery() {
    return this._gallery;
  }

  setProductGallery(data) {
    this._gallery = data;
  }

  getProductModes() {
    return this._modes;
  }

  setProductModes(data) {
    this._modes = data;
  }

  getProductAttributes() {
    return this._attributes;
  }

  setProductAttributes(data) {
    this._attributes = data;
  }

  getResult() {
    return this._result;
  }

  setResult(data) {
    this._result = data;
  }
}
