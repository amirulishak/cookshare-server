import { prop } from '@typegoose/typegoose';
import { Schema } from 'mongoose';

export class Image {
  // Created automatically, just needed for TS
  readonly _id: Schema.Types.ObjectId;

  @prop({ required: true })
  name: string;

  @prop({ default: { data: null, contentType: null } })
  image_file: {
    data: Buffer;
    contentType: string;
  };

  @prop()
  ownerId;

  @prop({ default: Date.now() })
  createdAt: Date;

  url: string;
}
