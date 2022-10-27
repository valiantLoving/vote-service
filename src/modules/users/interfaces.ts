import { CreateUserDto } from './dto/create-user.dto';
import { OmitType } from '@nestjs/mapped-types';

class CUserRes extends OmitType(CreateUserDto, ['password'] as const) {
  userId: number;
  password?: string;
  isActive: boolean;
}

export type IUserRes = CUserRes;
