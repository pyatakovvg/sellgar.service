
interface IResult {
  [key: string]: Array<any>;
}


export default function(query): IResult {
  const result = {};
  const keys = Object.keys(query);

  for (let index in keys) {
    const key = keys[index];
    if (query[key] instanceof Array) {
      result[key] = query[key];
    }
    else {
      result[key] = [query[key]];
    }
  }

  return result;
};
