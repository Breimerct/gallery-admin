import { Image, ImageSchema } from './schemas/gallery.schema';

import { AuthModule } from '@/auth/auth.module';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from '@/user/schemas/user.schema';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    UserModule,
  ],
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}
