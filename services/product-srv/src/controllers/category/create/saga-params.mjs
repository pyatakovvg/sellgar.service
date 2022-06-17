
export default class SagaParams {
  _category = null;
  _categoryBrand = null;
  _result = null;

  setResult(data) {
    this._result = data;
  }

  getResult() {
    return this._result;
  }

  setCategories(data) {
    this._category = data;
  }

  getCategories() {
    return this._category;
  }

  setCategoryBrand(data) {
    this._categoryBrand = data;
  }

  getCategoryBrand() {
    return this._categoryBrand;
  }
}
