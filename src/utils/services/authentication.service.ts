import jwt from 'jsonwebtoken'
import {scrypt, randomBytes} from 'crypto';
import {promisify} from 'util';
import {JwtPayload} from '../globals';

const scriptAsync = promisify(scrypt);

export class AuthenticationService {
  generateJwt(payload: JwtPayload, JWT_KEY: string) {
    return jwt.sign(payload, JWT_KEY, {expiresIn: '10d'});
  };

  async passwordToHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buff = (await scriptAsync(password, salt, 64)) as Buffer;

    return `${buff.toString('hex')}.${salt}`;
  };

  async passwordCompare(storedPwd: string, suppliedPwd: string) {
    const [hashedPwd, salt] = storedPwd.split('.');

    const buff = (await scriptAsync(suppliedPwd, salt, 64)) as Buffer;
    return buff.toString('hex') === hashedPwd;
  };

  vierifyJwt(jwtToken: string, JWT_KEY: string) {
    return jwt.verify(jwtToken, JWT_KEY) as JwtPayload;
  };
};
