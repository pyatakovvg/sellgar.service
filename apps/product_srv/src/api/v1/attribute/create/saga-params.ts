
export interface IParams {
  setResult(data: any): void;
  getResult(): any;
  setItem(data: any): void;
  getItem(): any;
}

export default class SagaParams implements IParams {
  _item = null;
  _result = null;

  setResult(data) {
    this._result = data;
  }

  getResult() {
    return this._result;
  }

  setItem(data) {
    this._item = data;
  }

  getItem() {
    return this._item;
  }
}
