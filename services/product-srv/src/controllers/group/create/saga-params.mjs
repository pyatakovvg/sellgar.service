
export default class SagaParams {
  _groups = null;
  _groupCategory = null;
  _result = null;

  setResult(data) {
    this._result = data;
  }

  getResult() {
    return this._result;
  }

  setGroups(data) {
    this._groups = data;
  }

  getGroups() {
    return this._groups;
  }

  setGroupCategory(data) {
    this._groupCategory = data;
  }

  getGroupCategory() {
    return this._groupCategory;
  }
}
