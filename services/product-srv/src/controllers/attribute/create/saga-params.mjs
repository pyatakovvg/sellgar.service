
export default class SagaParams {
  _attribute = null;
  _result = null;

  setResult(data) {
    this._result = data;
  }

  getResult() {
    return this._result;
  }

  setAttributes(data) {
    this._attribute = data;
  }

  getAttributes() {
    return this._attribute;
  }
}
