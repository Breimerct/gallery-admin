import { ValidationPipeTransform } from '@/common/pipe/ValidationPipeTransform';
import { rootPath } from '@/constants';
import { editFileName } from '@/helpers/utils';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get, Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { GalleryService } from './gallery.service';
import { AuthGuard } from '@/auth/guard/auth.guard';
import { ValidateFileInterceptor } from './interceptor/validate-file/validate-file.interceptor';
import { ValidateMongoIdGuard } from '@/common/guards/validate-mongo-id/validate-mongo-id.guard';
import { CreateImageDoc, GetAllImagesDoc, GetImageFileDoc, GetOneImageDoc, RemoveImageDoc, UpdateImageDoc, UpdateManyDoc } from './doc';

@Controller('gallery')
@ApiTags('Gallery')
@UseInterceptors(ClassSerializerInterceptor)
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post('image')
  @UseGuards(AuthGuard)
  @UseInterceptors(ValidateFileInterceptor)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: rootPath,
        filename: editFileName,
      }),
    }),
  )
  @CreateImageDoc()
  create(
    @Body(new ValidationPipeTransform()) createGalleryDto: CreateGalleryDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() request: Request,
  ) {
    return this.galleryService.create(createGalleryDto, image, request);
  }

  @Get('image/:imgName')
  @GetImageFileDoc()
  getImage(@Param('imgName') imgName: string, @Res() res: Response) {
    const imagePath = this.galleryService.getImage(imgName);

    res.sendFile(imagePath);
  }

  @Get('images/:id')
  @UseGuards(ValidateMongoIdGuard)
  @GetAllImagesDoc()
  findAll(@Param('id') userId: string) {
    return this.galleryService.findAllByUserId(userId);
  }

  @Get('image/:id')
  @UseGuards(AuthGuard)
  @UseGuards(ValidateMongoIdGuard)
  @GetOneImageDoc()
  findOne(@Param('id') id: string) {
    return this.galleryService.findOne(id);
  }

  @Patch('images/update-many')
  @UseGuards(AuthGuard)
  @UpdateManyDoc()
  updateMany(@Body() updateGalleryDto: UpdateGalleryDto[]) {
    return this.galleryService.updateMany(updateGalleryDto);
  }

  @Patch('image:id')
  @UseGuards(AuthGuard)
  @UseGuards(ValidateMongoIdGuard)
  @UpdateImageDoc()
  update(@Param('id') id: string, @Body() updateGalleryDto: UpdateGalleryDto) {
    return this.galleryService.update(id, updateGalleryDto);
  }

  @Delete('image/:id')
  @UseGuards(AuthGuard)
  @UseGuards(ValidateMongoIdGuard)
  @RemoveImageDoc()
  remove(@Param('id') id: string) {
    return this.galleryService.remove(id);
  }
}
