import { ConfigModule, ConfigService } from '@nestjs/config';

import { GalleryModule } from '@/gallery/gallery.module';
import { JwtConfigProvider } from '@/providers/jwt/jwtConfig.provider';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({ useClass: JwtConfigProvider, global: true }),
    GalleryModule,
  ],
})
export class AppModule {}
