import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
  UploadedFile,
  HttpStatus,
  Res,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from '@/helpers/utils';
import { Request, Response } from 'express';
import { rootPath } from '@/constants';
import { ValidationPipeTransform } from '@/common/pipe/ValidationPipeTransform';

@ApiTags('Gallery')
@Controller('gallery')
@UseInterceptors(ClassSerializerInterceptor)
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post('')
  @ApiOperation({
    summary: 'Create image',
    description: 'Create image',
  })
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
    @Body(new ValidationPipeTransform()) createGalleryDto: CreateGalleryDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() request: Request,
  ) {
    return this.galleryService.create(createGalleryDto, image, request);
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
  @ApiOperation({
    summary: 'Get all images',
    description: 'Get all images',
  })
  findAll() {
    return this.galleryService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get one image',
    description: 'Get one image by id',
  })
  findOne(@Param('id') id: string) {
    return this.galleryService.findOne(id);
  }

  @Patch('/update-many')
  @ApiOperation({
    summary: 'Update many images',
    description: 'Update many images at once',
  })
  @ApiBody({
    type: [UpdateGalleryDto],
  })
  updateMany(@Body() updateGalleryDto: UpdateGalleryDto[]) {
    return this.galleryService.updateMany(updateGalleryDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update image',
    description: 'Update image by id',
  })
  update(@Param('id') id: string, @Body() updateGalleryDto: UpdateGalleryDto) {
    return this.galleryService.update(id, updateGalleryDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete image',
    description: 'Delete image by id',
  })
  remove(@Param('id') id: string) {
    return this.galleryService.remove(id);
  }
}
