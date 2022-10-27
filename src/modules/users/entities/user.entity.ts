import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { UserRole } from '../constant';
import { IUserRes } from '../interfaces';
import * as _ from 'lodash';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({
    unique: true,
  })
  @Index()
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.COMMON,
  })
  role: UserRole;

  // @Column()
  // desc: string;

  @Column()
  email: string;

  @Column()
  idcard: string;

  @Column({ default: true })
  isActive: boolean;

  toObject(showPassword = false): IUserRes {
    return showPassword ? this : _.omit(this, 'password');
  }
}
