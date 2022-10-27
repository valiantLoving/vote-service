import { Global, Module } from '@nestjs/common';
import { Utils } from './utils';

/**utils 模块为全局模块, 不用额外 import */
@Global()
@Module({
  providers: [Utils],
  exports: [Utils],
})
export class UtilsModule {}
