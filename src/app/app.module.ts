import { Module } from '@nestjs/common';
import { GalleryModule } from '@/gallery/gallery.module';

@Module({
  imports: [
    GalleryModule,
  ],
})
export class AppModule {}
