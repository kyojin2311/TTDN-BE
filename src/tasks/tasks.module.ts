import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task, TaskSchema } from './schemas/task.schema';
import { Label, LabelSchema } from './schemas/label.schema';
import { LabelController } from './controllers/label.controller';
import { LabelService } from './services/label.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Label.name, schema: LabelSchema },
    ]),
    AuthModule,
  ],
  controllers: [TasksController, LabelController],
  providers: [TasksService, LabelService],
})
export class TasksModule {}
