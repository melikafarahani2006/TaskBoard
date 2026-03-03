import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ enum: ['todo', 'in-progress', 'done'], default: 'todo' })
  status: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);