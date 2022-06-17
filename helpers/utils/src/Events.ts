
class Events {
  private _events: object = {};

  emit(eventName, data) {
    if ( ! eventName) {
      throw new Error('EventName is not set');
    }
    if ( ! (eventName in this._events)) {
      return void 0;
    }
    const handlers = this._events[eventName];
    for (let index in handlers) {
      handlers[index].call(null, data);
    }
  }

  on(eventName, callback) {
    if ( ! eventName) {
      throw new Error('EventName is not set');
    }
    if ( ! this._events[eventName]) {
      this._events[eventName] = [];
    }
    this._events[eventName].push(callback);
  }

  off(eventName, callback) {
    if ( ! eventName) {
      throw new Error('EventName is not set');
    }
    if ( ! (eventName in this._events)) {
      return void 0;
    }
    this._events[eventName]  = this._events[eventName].filter((handler) => handler !== callback);
  }
}

export default Events;
