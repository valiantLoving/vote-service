import * as Joi from '@hapi/joi';

export const castVoteSchema = Joi.object({
  // 选举id
  voteId: Joi.number().required(),

  // 所投候选人id
  candidateId: Joi.string().required(),

  // 当成普通用户角色
  role: Joi.number().default(1),
  // 登记邮箱
  email: Joi.string().email().required(),
  //身份证号码
  idcard: Joi.string()
    .regex(/^[a-zA-Z]\d{6}\(\d\)$/)
    .required(),
});
