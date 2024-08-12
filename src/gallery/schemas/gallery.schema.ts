import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { User } from '@/user/schemas/user.schema';

export type ImageDocument = HydratedDocument<Image>;

@Schema({ versionKey: false })
export class Image {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageUri: string;

  @Prop({ required: true })
  order: number;

  @Prop({ required: false, default: new Date() })
  createdAt: Date;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  userId: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
