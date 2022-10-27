import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ISendMail } from 'src/interfaces/send-mail.interface';
import * as _ from 'lodash';

@Injectable()
export class MailProvider {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * 邮件发送
   */
  public sendMail(mail: ISendMail): void {
    this.mailerService
      .sendMail(mail)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .then(() => {
        console.log(`邮件发送成功`);
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch((err) => {
        console.error(`邮件发送失败:`, err);
      });
  }

  sendVoteResultMail(to, vote) {
    if (_.isEmpty(to)) return;
    this.sendMail({
      to,
      from: '1025605543@qq.com',
      subject: `选举【${vote.topic}】最终结果`,
      template: 'vote-result',
      context: {
        vote_result: JSON.stringify(vote.candidateVoteNum),
      },
    });
  }
}
