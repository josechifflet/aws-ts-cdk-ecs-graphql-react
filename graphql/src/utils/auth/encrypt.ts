import crypto from 'crypto'
import { config } from '../../config';

const algorithm = 'aes-256-ctr';
const password = config.encryptPassword!;

export const encrypt = (text: string) => {
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
export const decrypt = (text: string) => {
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}