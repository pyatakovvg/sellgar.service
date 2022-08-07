
function isJSON(data: string): boolean {
  try {
    JSON.parse(data);
    return true;
  }
  catch (e) {
    return false;
  }
}

export default isJSON;
