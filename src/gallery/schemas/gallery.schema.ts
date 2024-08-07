import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

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
}

export const ImageSchema = SchemaFactory.createForClass(Image);
