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
import { JWT_SECRET_KEY } from '@/constants';
import { JwtService } from '@nestjs/jwt';
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
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async login(loginDto: AuthLoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findOne({ email });

    const isMatch = await validatePassword(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Password is incorrect');
    }

    const payload = { email: user.email, _id: user._id };
    const token = await this.jwtService
      .signAsync(payload)
      .catch(internalServerError);

    return {
      user: plainToClass(ResponseUserDto, user),
      token,
    };
  }

  async register(userDto: CreateUserDto) {
    const newUser = await this.userService.create(userDto);

    const payload = { email: newUser.email, _id: newUser._id };
    const token = await this.jwtService
      .signAsync(payload)
      .catch(internalServerError);

    return {
      user: plainToClass(ResponseUserDto, newUser),
      token,
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

    const payload = { email: user.email, _id: user._id };

    const token = await this.jwtService
      .signAsync(payload, { expiresIn: '1h' })
      .catch(internalServerError);

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

    await this.userService
      .update(user._id, {
        password: newPasswordHash,
      })
      .catch(internalServerError);

    return {
      status: HttpStatus.OK,
      message: 'Password has been successfully reset',
    };
  }

  private async validateResetPasswordToken(token: string) {
    try {
      const { email } = await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET_KEY,
      });

      const user = await this.userService.findOne({ email });

      return plainToClass(ResponseUserDto, user);
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
