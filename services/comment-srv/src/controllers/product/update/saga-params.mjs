
export default class SagaParams {
  _comment = null;
  _result = null;

  setResult(data) {
    this._result = data;
  }

  getResult() {
    return this._result;
  }

  setComment(data) {
    this._comment = data;
  }

  getComment() {
    return this._comment;
  }
}
