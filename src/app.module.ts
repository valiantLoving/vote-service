import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import * as Joi from '@hapi/joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { VotesModule } from './modules/votes/votes.module';
import { UtilsModule } from './utils/utils.module';
import { RedisModule } from 'nestjs-redis';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      // 配置全局可用
      isGlobal: true,
      // 配置项校验
      validationSchema: Joi.object({
        // 服务名称
        name: Joi.string().required(),
        env: Joi.string().valid('dev', 'test', 'stage', 'prd').default('dev'),
        port: Joi.number().default(3000),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          host: configService.get<string>('redis_host') || 'redis',
          port: +configService.get<number>('redis_port') || 6379,
          prefix: configService.get('name'),
          db: configService.get('name').length % 16,
          name: configService.get('name'),
          onClientReady: () => {
            console.log('redis 连接成功');
          },
        };
      },
      inject: [ConfigService],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('pg_host'),
          port: configService.get<number>('pg_port'),
          username: configService.get<string>('pg_username'),
          password: configService.get<string>('pg_password'),
          database: configService.get<string>('pg_database'),
          synchronize: true,
          logging: true,
          entities: [],
          subscribers: [],
          migrations: [],
          autoLoadEntities: true,
        };
      },
    }),

    MailerModule.forRoot({
      transport: {
        host: 'smtp.qq.com',
        port: 25,
        ignoreTLS: true,
        secure: false,
        auth: {
          // 暂时硬编码
          user: '1025605543@qq.com',
          pass: 'qqvlfiqctkgybcgc',
        },
      },
      defaults: {
        from: '"难相见，易相别" <1025605543@qq.com>',
      },
      preview: false,
      template: {
        dir: process.cwd() + '/template/',
        adapter: new PugAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),

    UtilsModule,

    UsersModule,

    AuthModule,

    VotesModule,
  ],
  controllers: [],
  providers: [AuthService, JwtService],
})
export class AppModule {}
