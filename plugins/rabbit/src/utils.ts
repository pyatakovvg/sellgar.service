
import fs from 'fs';
import path from 'path';


export async function getFiles(pathName: string, result: Array<string> = []) {
  const files: Array<any> = fs.readdirSync(pathName);
  for (let index in files) {
    const file = files[index];
    const pathToFile = path.resolve(pathName + '/' + file.toString());
    if (fs.lstatSync(pathToFile).isDirectory()) {
      result = [...result, ...await getFiles(pathToFile)];
    }
    else {
      result.push(pathToFile);
    }
  }
  return result;
}
