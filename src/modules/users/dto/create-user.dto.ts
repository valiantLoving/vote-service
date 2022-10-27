// 这里只定义结果，校验交给joi-schena
export class CreateUserDto {
  // 用户名
  username: string;
  // 密码
  password: string;
  // 用户角色，暂不做多角色
  role: number;
  // 登记邮箱
  email: string;
  //身份证号码
  idcard: string;
}
