import { IsString, IsArray } from 'class-validator';

export class CreateVoteDto {
  // 选举标题
  @IsString()
  topic: string;

  // 开始时间

  // 结束时间

  // 候选人列表
  @IsArray()
  candidateIds: string[];

  toVoteEntity(user) {
    return Object.assign(this, {
      creator: user.userId,
      // 创建时每个候选人初始化为0票
      candidateVoteNum: this.candidateIds.reduce(
        (voteNumInfo, id) => Object.assign(voteNumInfo, { [id]: 0 }),
        {},
      ),
    });
  }
}
