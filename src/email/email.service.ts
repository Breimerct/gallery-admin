import { BadRequestException, Injectable } from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordResetEmail(frontUrl: string, email: string, token: string) {
    try {
      const resetPasswordUrl = `${frontUrl}/?token=${token}`;

      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset Your Password',
        template: 'reset-password',
        context: {
          resetPasswordUrl,
        },
      });
    } catch (error) {
      throw new BadRequestException('Error sending email');
    }
  }
}
