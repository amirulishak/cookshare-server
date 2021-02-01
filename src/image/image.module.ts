import {
  Module,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import { Image } from './image.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuthModule } from 'src/auth/auth.module';

const imageFilter = function (req, file, cb) {
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    cb(
      new BadRequestException(
        `Unsupported file type ${extname(file.originalname)}`,
      ),
      false,
    );
  }
  cb(null, true);
};

@Module({
  controllers: [ImageController],
  providers: [ImageService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: Image,
        schemaOptions: { versionKey: false },
      },
    ]),
    MulterModule.registerAsync({
      useFactory: () => ({
        fileFilter: imageFilter,
        dest: '/upload',
      }),
    }),
    AuthModule,
  ],
})
export class ImageModule {}
