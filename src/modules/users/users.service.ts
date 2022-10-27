import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { IUserRes } from './interfaces';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 简单起见,尚未对password用单向散列函数加密
  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findOne(userId: number) {
    return this.userRepository.findOne({ where: { userId } });
  }

  async findOneByName(
    username: string,
    showPassword: boolean,
  ): Promise<IUserRes> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user.toObject(showPassword);
  }
}
