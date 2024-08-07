import { Image, ImageSchema } from './schemas/gallery.schema';

import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
  ],
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}
