
export default class SagaParams {
  _themes = null;
  _comment = null;
  _result = null;

  setResult(data) {
    this._result = data;
  }

  getResult() {
    return this._result;
  }

  setThemes(data) {
    this._themes = data;
  }

  getThemes() {
    return this._themes;
  }

  setComment(data) {
    this._comment = data;
  }

  getComment() {
    return this._comment;
  }
}
