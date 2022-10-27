import * as Joi from '@hapi/joi';

export const createUserSchema = Joi.object({
  // 用户名
  username: Joi.string().required(),
  // 密码
  password: Joi.string().required(),
  // 用户角色，暂不做多角色
  role: Joi.number().valid(1, 2).required(),
  // 登记邮箱
  email: Joi.string().email().required(),
  //身份证号码
  idcard: Joi.string()
    .regex(/^[a-zA-Z]\d{6}\(\d\)$/)
    .required(),
});
