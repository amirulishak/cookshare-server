import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Image } from './image.model';
import { User } from 'src/user/user.entity';

@Injectable()
export class ImageService {
  private logger = new Logger('ImageService');
  constructor(
    @InjectModel(Image)
    private readonly imageModel: ReturnModelType<typeof Image>,
  ) {}

  async create(
    user: User,
    file,
    body: { name: string; image_file: Buffer },
  ): Promise<any> {
    const newImage = await new this.imageModel(body);
    newImage.image_file.data = file.buffer;
    newImage.image_file.contentType = file.mimetype;
    newImage.ownerId = user.id;
    this.logger.debug(
      `Uploaded image ${JSON.stringify({
        createdAt: newImage.createdAt,
        _id: newImage._id,
        name: newImage.name,
        url: newImage.url,
        ownderId: newImage.ownerId,
      })}`,
    );

    return await newImage.save();
  }

  async findAll(): Promise<Image[] | null> {
    return await this.imageModel.find({}, { image_file: 0 }).lean().exec();
  }

  async getById(id): Promise<Image> {
    return await this.imageModel.findById(id).exec();
  }

  async removeImage(id): Promise<Image> {
    return this.imageModel.findByIdAndDelete(id);
  }
}
