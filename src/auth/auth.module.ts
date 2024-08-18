import { AuthController } from './auth.controller';
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './auth.service';
import { EmailService } from '@/email/email.service';
import { JwtTokenModule } from '@/jwt-token/jwt-token.module';
import { Module } from '@nestjs/common';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, EmailService, AuthGuard],
})
export class AuthModule {}
