import { IUser } from 'src/interfaces/users.interface';
import { UserRole } from 'src/modules/users/constant';
import { HttpException } from '@nestjs/common';
import { Vote } from 'src/modules/votes/entities/vote.entity';
import { VoteStatus } from 'src/modules/votes/constant';
import _ = require('lodash');
import { MIN_VOTE_CANDIDATE_COUNT } from './constant';

export function checkIsAdmin(user: IUser, throwExceptionIfNot = true) {
  const isAdmin = user.role === UserRole.ADMIN;
  if (!isAdmin && throwExceptionIfNot)
    throw new HttpException('非系统管理员,无权限', 400);
  return isAdmin;
}

// 检查投票任务是否存在
function checkVote(vote: Vote, throwExceptionIfNot = true): boolean {
  const isNotExist = _.isNil(vote);
  if (isNotExist && throwExceptionIfNot)
    throw new HttpException('投票任务不存在', 400);
  return !isNotExist;
}

export function checkVoteIsNotStart(vote: Vote, throwExceptionIfNot = true) {
  checkVote(vote, true);
  const isNotStart = vote.status === VoteStatus.NOT_STARTED;
  if (!isNotStart && throwExceptionIfNot)
    throw new HttpException(
      vote.status === VoteStatus.PROGRESSING ? '投票已经开始' : '投票已经结束',
      400,
    );
  return isNotStart;
}

export function checkVoteCanStart(vote: Vote, throwExceptionIfNot = true) {
  // 必须尚未开始
  const isNotStart = checkVoteIsNotStart(vote, throwExceptionIfNot);
  if (!isNotStart) return false;

  // 检查候选人,至少两人
  if (_.size(vote.candidateVoteNum) < MIN_VOTE_CANDIDATE_COUNT)
    throw new HttpException(
      `一场选举至少需要两名候选人, 当前仅有${_.size(vote.candidateVoteNum)}名`,
      400,
    );
  return true;
}

export function checkVoteIsProgressing(vote: Vote, throwExceptionIfNot = true) {
  checkVote(vote, true);
  const isProgressing = vote.status === VoteStatus.PROGRESSING;
  if (!isProgressing && throwExceptionIfNot)
    throw new HttpException(
      vote.status === VoteStatus.NOT_STARTED ? '投票尚未开始' : '投票已经结束',
      400,
    );
  return isProgressing;
}

export function checkVoteHaveStarted(vote: Vote, throwExceptionIfNot = true) {
  const isNotStart = checkVoteIsNotStart(vote, false);
  if (throwExceptionIfNot && isNotStart) throw new HttpException(`投票尚未开始`, 400);
  return true;
}
