import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  UsePipes,
  Request,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from '../users/constant';
import { checkIsAdmin } from 'src/common/checks';
import { AddCandidateDto } from './dto/add-candidate.dto';
import { JoiValidationPipe } from 'src/pipes/joi_validation';
import { castVoteSchema } from './joi-schema/cast-vote.schema';
import { CastVoteDto } from './dto/cast-vote.dto';
import { PageQueryDto } from 'src/common/page-query.dto';

// 投票任务的创建者和后续操作可以是不同的管理员,可以添加操作记录，暂未处理
@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  // 管理员创建投票任务
  // 为了简单起见，尚未创建候选人表
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Request() req, @Body() createVoteDto: CreateVoteDto) {
    checkIsAdmin(req.user);
    console.log(
      `创建投票任务,创建者:${req.user.userId},Dto:${JSON.stringify(
        createVoteDto,
      )}`,
    );
    return this.votesService.create(createVoteDto.toVoteEntity(req.user));
  }

  // 管理员在投票任务开始前添加候选人
  // 暂未校验候选人id
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN)
  @Post('/addCandidate')
  addCandidate(@Request() req, @Body() addCandidateDto: AddCandidateDto) {
    checkIsAdmin(req.user);
    console.log(
      `添加候选人,操作人:${req.user.userId},Dto:${JSON.stringify(
        addCandidateDto,
      )}`,
    );
    return this.votesService.addCandidate(addCandidateDto);
  }

  // 管理员开启投票
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN)
  @Post('start')
  start(@Request() req, @Body('voteId') voteId: number) {
    checkIsAdmin(req.user);
    console.log(`开始投票,操作人:${req.user.userId},voteId:${voteId}`);
    return this.votesService.start(voteId);
  }

  // 管理员结束选举投票
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN)
  @Post('stop')
  stop(@Request() req, @Body('voteId') voteId: number) {
    checkIsAdmin(req.user);
    console.log(`结束投票,操作人:${req.user.userId},voteId:${voteId}`);
    return this.votesService.stop(voteId);
  }

  // 普通用户投出自己的一票   注：普通用户这里不走注册登陆和jwt授权逻辑(当前也可以走这套逻辑,用户模块已实现)
  // 简单起见,这里仅以合法的身份证号作为普通用户唯一性的判定依据
  // TODO 如果该接口并发比较大,可考虑在redis中进行
  @Post('cast')
  @UsePipes(new JoiValidationPipe(castVoteSchema))
  castVote(@Body() castVoteDto: CastVoteDto) {
    console.log(
      `普通用户投票,身份证号:${castVoteDto.idcard}, voteId:${castVoteDto.voteId}, candidateId:${castVoteDto.candidateId}`,
    );
    return this.votesService.castVote(castVoteDto);
  }

  // 管理员查看选举的实时情况
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN)
  @Get('/detail/:voteId')
  findOneDetail(@Request() req, @Param('voteId') voteId: string) {
    checkIsAdmin(req.user);
    return this.votesService.findOneDetail(+voteId);
  }

  // 管理员查看某个候选人的获票详情
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN)
  @Get('/detail/:voteId/:candidateId')
  findCandidateVoteDetail(
    @Request() req,
    @Param('voteId') voteId: string,
    @Param('candidateId') candidateId: string,
    @Query() pageQueryDto: PageQueryDto,
  ) {
    checkIsAdmin(req.user);
    return this.votesService.findCandidateVoteDetail(
      +voteId,
      candidateId,
      pageQueryDto,
    );
  }
}
