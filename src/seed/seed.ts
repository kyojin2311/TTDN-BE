import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TasksService } from '../tasks/tasks.service';
import { LabelService } from '../tasks/services/label.service';
import { TaskStatus } from '../tasks/schemas/task.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const tasksService = app.get(TasksService);
  const labelService = app.get(LabelService);

  // Tạo một số labels mẫu
  const labels = await Promise.all([
    labelService.create({ name: 'Work', color: '#FF0000' }, 'test-user-id'),
    labelService.create({ name: 'Personal', color: '#00FF00' }, 'test-user-id'),
    labelService.create({ name: 'Urgent', color: '#0000FF' }, 'test-user-id'),
  ]);

  // Tạo một số tasks mẫu
  const tasks = [
    {
      title: 'Complete project documentation',
      description: 'Write comprehensive documentation for the project',
      status: TaskStatus.TODO,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      labels: [(labels[0] as any)._id], // Work label
    },
    {
      title: 'Buy groceries',
      description: 'Get milk, eggs, and bread',
      status: TaskStatus.DOING,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
      labels: [(labels[1] as any)._id], // Personal label
    },
    {
      title: 'Fix critical bug',
      description: 'Fix the authentication bug in production',
      status: TaskStatus.TODO,
      deadline: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
      labels: [(labels[0] as any)._id, (labels[2] as any)._id], // Work and Urgent labels
    },
  ];

  // Tạo tasks
  for (const task of tasks) {
    await tasksService.create(task, 'test-user-id');
  }

  console.log('Seed data created successfully!');
  await app.close();
}

bootstrap();
