
import type * as jsonwebtoken from "jsonwebtoken";
import { JsonwebtokenService } from "../jwt-service.port";
import jwt from "jsonwebtoken";

export class JsonwebtokenServiceImpl implements JsonwebtokenService {
  protected jwtSign: typeof jsonwebtoken.sign;
  protected jwtVerify: typeof jsonwebtoken.verify;
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
    this.jwtSign = jwt.sign;
    debugger;
    this.jwtVerify = jwt.verify;
  }

  verify(
    token: string,
    secretOrPublicKey: jsonwebtoken.Secret,
    options: {
      algorithms?: jsonwebtoken.Algorithm[];
    }
  ): string | jsonwebtoken.JwtPayload {
    const result = this.jwtVerify(token, secretOrPublicKey, options);
    return result;
  }
  sign(
    // eslint-disable-next-line @typescript-eslint/ban-types
    payload: string | object | Buffer,
    secretOrPrivateKey: jsonwebtoken.Secret
  ): string {
    const result = this.jwtSign(payload, secretOrPrivateKey);
    return result;
  }
}
