import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  checkVoteCanStart,
  checkVoteHaveStarted,
  checkVoteIsNotStart,
  checkVoteIsProgressing,
} from 'src/common/checks';
import { Repository, DataSource } from 'typeorm';
import { VoteStatus } from './constant';
import { AddCandidateDto } from './dto/add-candidate.dto';
import { CastVoteDto } from './dto/cast-vote.dto';
import { CreateVoteDto } from './dto/create-vote.dto';
import { Vote } from './entities/vote.entity';
import { VoteRecord } from './entities/vote-record.entity';
import * as _ from 'lodash';
import { HttpException } from '@nestjs/common';
import { PageQueryDto } from 'src/common/page-query.dto';
import { Utils } from 'src/utils/utils';
import { RedisProvider } from 'src/providers/redis.provider';
import { MailProvider } from 'src/providers/mail.provider';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
    @InjectRepository(VoteRecord)
    private voteRecordRepository: Repository<VoteRecord>,
    private dataSource: DataSource,
    private utils: Utils,
    private redisProdiver: RedisProvider,
    private mailProvider: MailProvider,
  ) {}

  create(createVoteDto: CreateVoteDto) {
    return this.voteRepository.save(createVoteDto);
  }

  async addCandidate(addCandidateDto: AddCandidateDto) {
    const vote = await this.findOne(addCandidateDto.voteId);
    // 投票任务必须存在且尚未开始
    checkVoteIsNotStart(vote);
    vote.candidateVoteNum = addCandidateDto.candidateIds.reduce(
      (voteNumInfo, cid) => Object.assign(voteNumInfo, { [cid]: 0 }),
      vote.candidateVoteNum,
    );
    // 更新候选人的得票记录
    await this.voteRepository.update(
      { voteId: vote.voteId },
      { candidateVoteNum: vote.candidateVoteNum },
    );
  }

  async start(voteId: number) {
    const vote = await this.findOne(voteId);
    checkVoteCanStart(vote);
    this.markVoteStart(vote);
    await this.voteRepository.update({ voteId }, vote);
  }

  // 标记选举开始
  markVoteStart(vote: Vote) {
    vote.startDate = new Date();
    vote.status = VoteStatus.PROGRESSING;
  }

  async stop(voteId: number) {
    const vote = await this.findOne(voteId);
    // 必须是进行中的
    checkVoteIsProgressing(vote);
    this.markVoteStop(vote);
    await this.voteRepository.update({ voteId }, vote);

    // 异步给普通投票用户发邮件
    this.sendVoteResultMail(vote);
  }

  markVoteStop(vote: Vote) {
    vote.endDate = new Date();
    vote.status = VoteStatus.END;
  }

  async sendVoteResultMail(vote: Vote) {
    // 从投票记录中拿到所有目标邮箱
    const records = await this.voteRecordRepository
      .createQueryBuilder('vote_record')
      .where('vote_record.voteId = :voteId', { voteId: vote.voteId })
      .select(['email'])
      .getMany();

    // this.mailProvider.sendMail({
    //   to: '1025605543@qq.com',
    //   from: '1025605543@qq.com',
    //   subject: `选举【${vote.topic}】最终结果`,
    //   text: `感谢你的参与,一下是最终结果:${JSON.stringify(
    //     vote.candidateVoteNum,
    //   )}`,
    // });
    const targetMailAddress = records.map((r) => r.email);
    this.mailProvider.sendVoteResultMail(targetMailAddress, vote);
  }

  checkCandidateCanBeVoted(vote: Vote, candidateId: string) {
    if (_.isNil(vote.candidateVoteNum[candidateId])) {
      throw new HttpException(`该选举中不存在的候选人:${candidateId}`, 400);
    }
  }

  async castVote(castVoteDto: CastVoteDto) {
    const vote = await this.findOne(castVoteDto.voteId);
    checkVoteIsProgressing(vote);
    this.checkCandidateCanBeVoted(vote, castVoteDto.candidateId);

    const userCastRecord = await this.voteRecordRepository.findOne({
      where: { voteId: vote.voteId, idcard: castVoteDto.idcard },
    });
    if (userCastRecord)
      throw new HttpException(`每次选举限投票一次,请勿再次投票`, 400);

    // 更新用户投票,并存储投票记录 (事务)
    vote.candidateVoteNum[castVoteDto.candidateId]++;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(
        Vote,
        { voteId: vote.voteId },
        { candidateVoteNum: vote.candidateVoteNum },
      );
      await queryRunner.manager.save(
        VoteRecord,
        Object.assign(castVoteDto, {
          castDate: new Date(),
        }),
      );
      // commit transaction now:
      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors let's rollback changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // release query runner which is manually created:
      await queryRunner.release();
    }
    return vote;
  }

  findOne(voteId: number) {
    return this.voteRepository.findOne({ where: { voteId } });
  }

  async findOneByCache(voteId: number) {
    // 已经结束了的选举可以使用redis缓存结果
    const cacheVote = await this.redisProdiver.get(`vote:${voteId}`);
    if (cacheVote) return JSON.parse(cacheVote) as Vote;
    const vote = await this.findOne(voteId);
    if (vote && vote.status === VoteStatus.END) {
      // 缓存1天
      await this.redisProdiver.set(
        `vote:${voteId}`,
        JSON.stringify(vote),
        3600 * 24,
      );
    }
    return vote;
  }

  async findOneHaveStarted(voteId: number) {
    const vote = await this.findOne(voteId);
    const isNotStart = checkVoteIsNotStart(vote, false);
    if (isNotStart) throw new HttpException(`投票尚未开始`, 400);
    return vote;
  }

  async findOneDetail(voteId: number) {
    // const vote = await this.findOneHaveStarted(voteId);
    // const isProgressing = vote.status === VoteStatus.PROGRESSING;
    // return isProgressing
    //   ? this.findOneProgressingDetail(vote)
    //   : this.findOneEndDetail(vote);
    const vote = await this.findOneByCache(voteId);
    checkVoteHaveStarted(vote);
    // 每个候选人默认展示第一页的投票
    const pageQuery = <PageQueryDto>({ page: 1, orderby: 'castDate' } as any);

    const candidateIds = Object.keys(vote.candidateVoteNum);

    return await Promise.all(
      candidateIds.map((candidateId) =>
        this.findCandidateVoteDetail(voteId, candidateId, pageQuery, vote),
      ),
    );
  }

  async findCandidateVoteDetail(
    voteId: number,
    candidateId: string,
    pageQueryDto: PageQueryDto,
    vote?: Vote,
  ) {
    vote = vote || (await this.findOneByCache(voteId));
    checkVoteHaveStarted(vote);
    // 检查候选人
    this.checkCandidateCanBeVoted(vote, candidateId);
    const page = this.utils.standardizedPage(pageQueryDto);

    // 候选人获票数量和得票记录总数一致
    page.meta.total = vote.candidateVoteNum[candidateId];
    // 未获选票
    if (page.meta.total === 0) return { meta: page.meta, list: [] };

    const queryBuilder = this.voteRecordRepository
      .createQueryBuilder('vote_record')
      .where('vote_record.voteId = :voteId', { voteId })
      .andWhere('vote_record.candidateId = :candidateId', { candidateId });

    // const count = await queryBuilder.getCount();
    const voteRecord = await queryBuilder
      .orderBy(`vote_record.${page.orderby}`, page.order)
      .skip(page.skip)
      .take(page.limit)
      .getMany();
    return { meta: page.meta, list: voteRecord };
  }
}
