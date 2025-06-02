import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Label } from './label.schema';

export enum TaskStatus {
  TODO = 'todo',
  DOING = 'doing',
  DONE = 'done',
}

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  userId: string; // Firebase uid

  @Prop({ required: true, get: (v) => v.toISOString() })
  deadline: Date;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Label' }] })
  labels: Label[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
