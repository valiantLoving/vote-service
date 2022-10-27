import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CastVoteDto {
  @IsNumber()
  voteId: number;
  @IsString()
  candidateId: string;
  @IsNumber()
  @IsOptional()
  role: number;
  @IsString()
  email: string;
  @IsString()
  idcard: string;
}
