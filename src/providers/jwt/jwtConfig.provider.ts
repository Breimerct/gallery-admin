import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtModuleOptions } from '@nestjs/jwt';

@Injectable()
export class JwtConfigProvider {
  constructor(private readonly configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      global: true,
      secret: this.configService.get('JWT_SECRET_KEY'),
      signOptions: {
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      },
    };
  }
}
