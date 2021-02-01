import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Res,
  Body,
  Get,
  Param,
  NotFoundException,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as config from 'config';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { User } from 'src/user/user.entity';

const host = config.get('db').host;

/**
 * Image Controller
 */
@ApiTags('image')
@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  /**
   * Upload Image
   * [POST]: api/v1/image
   * @param {any} file
   * @param {any} body
   * @returns {Promise<any>}
   */
  @Post('')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Upload an image to database' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @GetUser() user: User,
    @UploadedFile() file,
    @Body() body,
  ): Promise<any> {
    const image = await this.imageService.create(user, file, body);
    const newImage = image.toObject();

    newImage.image_file = undefined;
    newImage.url = `http://${host}/image/${newImage._id}`;

    return newImage;
  }

  /**
   * Get all images
   * [GET]: api/v1/image
   * @returns {Promise<Image[]>}
   */
  @Get('')
  @ApiOperation({ summary: 'Retrieve all images from database' })
  async getImages() {
    const images = await this.imageService.findAll();

    images.forEach((image) => {
      image.url = `http://${host}/image/${image._id}`;
    });

    return images;
  }

  /**
   * Get an image
   * [GET]: api/v1/image/:id
   * @returns {Promise<Image>}
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an image by ID from database' })
  async getImage(@Res() res, @Param('id') id) {
    const image = await this.imageService.getById(id);
    if (!image) throw new NotFoundException('Image does not exist!');
    res.setHeader('Content-Type', image.image_file.contentType);
    return image.image_file.data.buffer;
  }

  /**
   * Delete an image
   * [DELETE]: api/v1/image/:id
   * @returns {Promise<any>}
   */
  @Delete(':id')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Delete an image by ID from database' })
  async deleteImage(@Param('id') id) {
    const image = await this.imageService.removeImage(id);

    if (!image) throw new NotFoundException('Image does not exist!');
    return { message: 'Image removed.' };
  }
}
