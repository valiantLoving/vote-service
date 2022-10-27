import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';
import { VoteRecord } from './entities/vote-record.entity';
import { RedisProvider } from 'src/providers/redis.provider';
import { MailProvider } from 'src/providers/mail.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, VoteRecord])],
  controllers: [VotesController],
  providers: [VotesService, RedisProvider, MailProvider],
})
export class VotesModule {}
