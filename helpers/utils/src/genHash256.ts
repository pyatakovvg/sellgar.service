
import crypto from "crypto";


function genHash256(data: string, salt: string) {
  const hash = crypto.createHmac('sha256', salt);
  hash.update(data);
  return hash.digest('hex');
}

export default genHash256;
