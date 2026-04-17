import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Video {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  filename!: string;

  @Prop({ required: true })
  originalName!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ type: String, default: null })
  uploadedBy?: string;

  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  size!: number;

  @Prop({ type: Boolean, default: true })
  isActive!: boolean;

  @Prop({ type: Date, default: () => new Date() })
  createdAt!: Date;

  @Prop({ type: Date, default: () => new Date() })
  updatedAt!: Date;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
