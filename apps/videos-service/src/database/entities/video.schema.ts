import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'videos' })
export class Video {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  filename!: string;

  @Prop({ required: true })
  originalName!: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ type: String, default: null })
  category?: string;

  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  uploadId!: string;

  @Prop({ required: true })
  size!: number;

  @Prop({ required: true })
  s3Key!: string;

  @Prop({
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  })
  status!: 'draft' | 'published' | 'archived';

  @Prop({
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  })
  processingStatus!: 'pending' | 'processing' | 'completed' | 'failed';

  @Prop({ type: Boolean, default: false })
  isPublic!: boolean;

  @Prop({ type: Boolean, default: true })
  isActive!: boolean;

  @Prop({
    type: [
      {
        quality: String,
        s3Key: String,
        bitrate: String,
        resolution: String,
        duration: Number,
      },
    ],
    default: [],
  })
  versions?: Array<{
    quality: string;
    s3Key: string;
    bitrate: string;
    resolution: string;
    duration?: number;
  }>;

  @Prop({ type: Number, default: 0 })
  duration?: number;

  @Prop({ type: String, default: null })
  thumbnail?: string;

  @Prop({ type: Date, nullable: true })
  expiresAt?: Date;

  @Prop({ type: Date, default: () => new Date() })
  createdAt!: Date;

  @Prop({ type: Date, default: () => new Date() })
  updatedAt!: Date;

  @Prop({ type: Date, nullable: true })
  publishedAt?: Date;
}

export const VideoSchema = SchemaFactory.createForClass(Video);

VideoSchema.index({ expiresAt: 1 }, { sparse: true });
VideoSchema.index({ status: 1, expiresAt: 1 });
VideoSchema.index({ userId: 1, status: 1 });
VideoSchema.index({ processingStatus: 1 });
