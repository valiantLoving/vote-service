import {
  Controller,
  Get,
  Request,
  Post,
  Body,
  Param,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JoiValidationPipe } from 'src/pipes/joi_validation';
import { createUserSchema } from './joi-schema/create-user.schema';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // 注册账号
  @Post('/register')
  @UsePipes(new JoiValidationPipe(createUserSchema)) // 使用joi-schema进行参数校验
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // 登录
  @UseGuards(AuthGuard('local')) // 使用passport的LocalStrategy
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}
