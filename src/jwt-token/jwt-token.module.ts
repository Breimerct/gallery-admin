import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtToken, JwtTokenSchema } from './schemas/jwt-token.schema';

import { JwtModule } from '@nestjs/jwt';
import { JwtTokenService } from './jwt-token.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: JwtToken.name, schema: JwtTokenSchema }]),
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
              secret: configService.get('JWT_SECRET_KEY'),
              signOptions: {
                expiresIn: configService.get('JWT_EXPIRES_IN'),
              },
            }),
            inject: [ConfigService],
          }),
      ],
      providers: [JwtTokenService],
      exports: [JwtTokenService],
})
export class JwtTokenModule {}
