import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Req, UploadedFile, HttpStatus, Res } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from '@/helpers/utils';
import { Request, Response } from 'express';
import { rootPath } from '@/constants';

@ApiTags('Gallery')
@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) { }

  @Post('')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: rootPath,
        filename: editFileName,
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  create(
    @Body() createGalleryDto: CreateGalleryDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() request: Request
  ) {
    return this.galleryService.create(
      createGalleryDto,
      image,
      request
    );
  }

  @Get('img/:imgName')
  @ApiOperation({ summary: 'Get image' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'return image',
  })
  getImage(@Param('imgName') imgName: string, @Res() res: Response) {
    const imagePath = this.galleryService.getImage(imgName);

    res.sendFile(imagePath);
  }

  @Get()
  findAll() {
    return this.galleryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.galleryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGalleryDto: UpdateGalleryDto) {
    return this.galleryService.update(id, updateGalleryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.galleryService.remove(id);
  }
}
