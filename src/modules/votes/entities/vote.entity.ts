import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { VoteStatus } from '../constant';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  voteId: number;

  @Column()
  topic: string;

  @Column()
  creator: number;

  // 选举创建时间
  @Column({
    type: 'timestamptz',
    default: new Date(),
  })
  createDate: Date;

  // 开始时间
  @Column({
    type: 'timestamptz',
    default: null,
  })
  startDate: Date;

  // 结束时间
  @Column({
    type: 'timestamptz',
    default: null,
  })
  endDate: Date;

  //   @Column('simple-array')
  //   candidateIds: number[];

  @Column({
    type: 'jsonb',
    default: {},
  })
  candidateVoteNum: { [candidateId: string]: number };

  @Column({
    type: 'enum',
    enum: VoteStatus,
    default: VoteStatus.NOT_STARTED,
  })
  status: VoteStatus;
}
