import { PageQueryDto } from 'src/common/page-query.dto';

export class QueryCandidateVotedDetail extends PageQueryDto {
  voteId: number;
  candidateId: string;
}
