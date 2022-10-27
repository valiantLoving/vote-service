import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          code: 0,
          // 返回空时感觉改成success更能表达含义
          data: _.isNil(data) ? 'success' : data,
        };
      }),
    );
  }
}
