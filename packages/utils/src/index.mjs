
import fs from "fs";
import BusBoy from 'busboy';
import crypto from "crypto";


export const uniqName = () => {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'K', 'L', 'M', 'N', 'W', 'X', 'Y', 'Z'];
  const firstLetter = letters[Math.round(Math.random() * (letters.length - 1))];
  const secondLetter = letters[Math.round(Math.random() * (letters.length - 1))];
  const number = String(Date.now()).slice(-6);

  return `${firstLetter}${secondLetter}-${number}`;
};

export const UUID = () => {
  let dt = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt/16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};

export const sleep = async (time) => {
  return new Promise(resolve => setTimeout(resolve, time));
};

export const nounDeclension = (number = 0, titles = []) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[(number % 100 > 4 && number % 100 < 20)
    ? 2
    : cases[(number % 10 < 5)
      ? number % 10
      : 5]];
};

export const reduceToArray = (items, SIZE = 4) => {
  return items.reduce((p, c) => {
    if( p[p.length - 1].length === SIZE) {
      p.push([]);
    }
    p[p.length - 1].push(c);
    return p;
  }, [[]]);
};

export const getBuffer = (result) => {
  return new Promise((response, reject) => {

    const buffer = [];

    result.on('data', chunk => buffer.push(chunk));
    result.on('end', () => response(Buffer.concat(buffer)));
    result.on('error', error => reject(error));
  });
};

export const saveFile = (buffer, path) => {

  return new Promise((resolve) => {

    const stream = fs.createWriteStream(path);

    stream.write(buffer, 'utf16le', resolve);
  });
};

function convertData(value) {
  if (/^\d+(.\d+)?$/.test(value)) {
    return Number(value);
  }
  else if (/^null$/.test(value)) {
    return null;
  }
  return value;
}

export const getFiles = async (req) => {
  return new Promise((resolve, reject) => {

    const result = { files: {}, fields: {} };
    const bb = new BusBoy({ headers: req.headers });

    bb.on('file', (fieldName, file, fileName, encoding, mimeType) => {

      result['files'][fieldName] = {
        fileName: fileName,
        mimeType: mimeType,
        encoding: encoding,
        buffer: []
      };

      file.on('data', (data) => {
        result['files'][fieldName]['buffer'].push(data);
      });

      file.on('end', () => {
        result['files'][fieldName]['buffer'] = Buffer.concat(result['files'][fieldName]['buffer']);
      });
    });

    // bb.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    bb.on('field', function(fieldname, val) {
      result['fields'][fieldname] = convertData(val);
    });

    bb.on('error', error => reject(error));

    bb.on('finish', () => {
      resolve(result);
    });

    req.pipe(bb);
  });
};

export const token = (salt) => {
  return crypto.createHmac('sha256', salt);
};

export const genHash256 = (data, salt) => {
  const hash = token(salt);
  hash.update(data);
  return hash.digest('hex');
};
