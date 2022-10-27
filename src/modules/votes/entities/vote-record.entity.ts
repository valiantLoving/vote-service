import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import * as _ from 'lodash';

// 普通用户投票记录
@Entity()
@Index(['voteId', 'candidateId']) // 创建联合索引
export class VoteRecord {
  @PrimaryGeneratedColumn()
  voteRecordId: number;

  @Column()
  voteId: number;

  @Column()
  candidateId: string;

  @Column()
  idcard: string;

  @Column()
  email: string;

  // 投票时间
  @Column({
    type: 'timestamptz',
    default: new Date(),
  })
  castDate: Date;
}
