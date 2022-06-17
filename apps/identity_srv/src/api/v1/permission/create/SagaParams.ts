
export default class SagaParams {
  _permission: any;
  _result: any;

  set result(data: any) {
    this._result = data;
  }

  get result(): any {
    return this._result;
  }

  set permission(promotions: any) {
    this._permission = promotions;
  }

  get permission(): any {
    return this._permission;
  }
}
