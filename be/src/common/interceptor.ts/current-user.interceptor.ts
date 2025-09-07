import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { JwtPayload } from 'src/auth/dto/jwt-payload';
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<JwtPayload> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    request.user = request.user; // object từ JwtStrategy.validate
    if (request && request.headers && request.headers.authorization) {
      request.user = decodeToken(request.headers.authorization.split(' ')[1]);
    } else {
      request.user = null;
    }
    return next.handle();
  }
}

export const decodeToken = (token: string) => {
  let dataUser: object | string | JwtPayload | null;
  dataUser = jwt.decode(token);
  return <JwtPayload>dataUser;
};
