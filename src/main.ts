declare const module: any;
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RoleGuard } from './guards/roles.guard';
import { ValidationPipe } from '@nestjs/common';
import { CommonExceptionFilter } from './filters/common.exception.filter';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');

  // 拦截http请求的相应
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  // 使用全局验证管道
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // 使用全局的role守卫
  app.useGlobalGuards(new RoleGuard(new Reflector()));

  // 使用全局的异常过滤器
  app.useGlobalFilters(new CommonExceptionFilter());

  const configService = app.get(ConfigService);
  await app.listen(configService.get('port'));

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
