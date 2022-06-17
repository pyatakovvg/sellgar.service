
function Route(method: string, path: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      readonly path: string = path;
      readonly method: string = method;
    };
  }
}

export default Route;
