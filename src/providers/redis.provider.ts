import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

// redis 操作
// 使用这个版本 npm install nestjs-redis@1.2.2
@Injectable()
export class RedisProvider {
  client: Redis;
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async root() {
    this.client = await this.redisService.getClient();
    return this;
  }

  async _checkRoot() {
    if (!this.client || this.client.status !== 'ready') await this.root();
  }

  async set(key: string, value: any, seconds?: number) {
    await this._checkRoot();
    if (!seconds) {
      await this.client.set(key, value);
    } else {
      await this.client.set(key, value, 'EX', seconds);
    }
  }

  async get(key: string) {
    await this._checkRoot();
    const data = await this.client.get(key);
    return data;
  }

  async del(key: string) {
    await this._checkRoot();
    const data = await this.client.del(key);
    return data;
  }
}
