
export interface IParams {
  setGallery(data: any): void;
  getGallery(): any;
  setModes(data: any): void;
  getModes(): any;
  setAttributes(data: any): void;
  getAttributes(): any;
  setProduct(data: any): void;
  getProduct(): any;
  setResult(data: any): void;
  getResult(): any;
}


class SagaParams implements IParams {
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

  setResult(data): any {
    this._result = data;
  }
}

export default SagaParams;
