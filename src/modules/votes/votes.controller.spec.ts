import { Test, TestingModule } from '@nestjs/testing';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';

describe('VotesController', () => {
  let controller: VotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VotesController],
      providers: [VotesService],
    }).compile();

    controller = module.get<VotesController>(VotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

describe('VotesController', () => {
  let votesController: VotesController;
  let votesService: VotesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [VotesController],
      providers: [VotesService],
    }).compile();

    votesService = moduleRef.get<VotesService>(VotesService);
    votesController = moduleRef.get<VotesController>(VotesController);
  });

  describe('create', () => {
    it('非管理员创建会提示错误', async () => {});
  });

  describe('addCandidate', () => {
    it('选举尚未开始才能添加候选人', async () => {});

    it('新加候选人初始化其得票数为0', async () => {});
  });

  describe('start', () => {
    it('选举的候选人至少两位', async () => {});
  });

  describe('stop', () => {
    it('选举结束后更新状态为已结束', async () => {});
  });

  describe('cast', () => {
    it('普通用户投票需验证邮箱和身份证号', async () => {});

    it('每次选举限投票一次', async () => {});
  });

  describe('/detail/:voteId', () => {
    it('每个候选人的得票数等于其对应的投票记录之和', async () => {});
  });

  describe('/detail/:voteId/:candidateId', () => {
    it('返回数据包含meta和list字段', async () => {});
  });
});
