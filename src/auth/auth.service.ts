import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import {
  hashPassword,
  internalServerError,
  validatePassword,
} from '@/helpers/utils';

import { AuthLoginDto } from './dto/auth-login.dto';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { EmailResetPassDto } from './dto/emal-reset-pass';
import { EmailService } from '@/email/email.service';
import { JwtTokenService } from '@/jwt-token/jwt-token.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResponseMessageDto } from '@/common/dto/response-message.dto';
import { ResponseUserDto } from '@/user/dto/response-user.dto';
import { UpdatePassDto } from './dto/update-pass.dto';
import { UserService } from '@/user/user.service';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly emailService: EmailService,
  ) {}

  async login(loginDto: AuthLoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findOne({ email });

    const isMatch = await validatePassword(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Password is incorrect');
    }

    const tokenId = await this.jwtTokenService.createToken(user._id.toString());

    return {
      user: plainToClass(ResponseUserDto, user),
      token: tokenId,
    };
  }

  async register(userDto: CreateUserDto) {
    const newUser = await this.userService.create(userDto);

    const tokenId = await this.jwtTokenService.createToken(
      newUser._id.toString(),
    );

    return {
      user: plainToClass(ResponseUserDto, newUser),
      token: tokenId,
    };
  }

  async updatePassword(_id: string, passwordDto: UpdatePassDto) {
    const user = await this.userService.findOne({ _id });

    const isMatchOldPassword = await validatePassword(
      passwordDto.oldPassword,
      user.password,
    );

    const isMatchNewPassword = await validatePassword(
      passwordDto.newPassword,
      user.password,
    );

    if (!isMatchOldPassword) {
      throw new BadRequestException('Old password is incorrect');
    }

    if (isMatchNewPassword) {
      throw new BadRequestException(
        'New password is the same as the old password',
      );
    }

    const passwordHash = await hashPassword(passwordDto.newPassword);

    const updatedUser = await this.userService.update(_id, {
      password: passwordHash,
    });

    return plainToClass(ResponseUserDto, updatedUser);
  }

  async sendPasswordResetEmail({
    email,
    frontUrl,
  }: EmailResetPassDto): Promise<ResponseMessageDto> {
    const user = await this.userService.findOne({
      email,
    });

    const token = await this.jwtTokenService.createToken(
      user._id.toString(),
      '1h',
    );

    return await this.emailService
      .sendPasswordResetEmail(frontUrl, email, token)
      .then(() => {
        return {
          status: HttpStatus.OK,
          message: 'Email sent successfully',
        };
      });
  }

  async resetPasswordWithToken({
    token,
    newPassword,
  }: ResetPasswordDto): Promise<ResponseMessageDto> {
    const user = await this.validateResetPasswordToken(token);
    const newPasswordHash = await hashPassword(newPassword);

    await this.userService.update(user._id, {
      password: newPasswordHash,
    });

    await this.jwtTokenService.deleteToken(token);

    return {
      status: HttpStatus.OK,
      message: 'Password has been successfully reset',
    };
  }

  async logout(tokenId: string) {
    await this.jwtTokenService.deleteToken(tokenId);

    return {
      status: HttpStatus.OK,
      message: 'Logout successfully',
    };
  }

  private async validateResetPasswordToken(token: string) {
    const _id = await this.jwtTokenService.verifyToken(token);

    const user = await this.userService.findOne({ _id });

    return plainToClass(ResponseUserDto, user);
  }
}
