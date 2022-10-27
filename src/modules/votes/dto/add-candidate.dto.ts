import { IsString, IsArray, IsNumber } from 'class-validator';

export class AddCandidateDto {
  // 选举标题
  @IsNumber()
  voteId: number;

  // 候选人列表
  @IsArray()
  candidateIds: string[];
}
