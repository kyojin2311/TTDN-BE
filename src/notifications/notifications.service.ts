import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { TasksService } from '../tasks/tasks.service';
import { TaskDocument } from '../tasks/schemas/task.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    private tasksService: TasksService,
  ) {}

  async create(notification: Partial<Notification>): Promise<Notification> {
    const createdNotification = new this.notificationModel(notification);
    return createdNotification.save();
  }

  async findAll(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    return this.notificationModel
      .findOneAndUpdate({ _id: id, userId }, { isRead: true }, { new: true })
      .exec();
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel.updateMany({ userId, isRead: false }, { isRead: true }).exec();
  }

  @Cron(CronExpression.EVERY_HOUR)
  async checkDeadlines() {
    const fourHoursFromNow = new Date(Date.now() + 4 * 60 * 60 * 1000);

    // Lấy tất cả tasks có deadline trong 4 giờ tới và chưa hoàn thành
    const tasks = await this.tasksService.findTasksWithDeadline(fourHoursFromNow);

    for (const task of tasks as TaskDocument[]) {
      // Kiểm tra xem đã có notification cho task này chưa
      const existingNotification = await this.notificationModel.findOne({
        taskId: task._id,
        type: 'DEADLINE_REMINDER',
        createdAt: { $gte: new Date(Date.now() - 4 * 60 * 60 * 1000) }, // Trong 4 giờ gần đây
      });

      if (!existingNotification) {
        // Tạo notification mới
        await this.create({
          userId: task.userId,
          taskId: task._id.toString(),
          title: 'Deadline Reminder',
          message: `Task "${task.title}" is due in 4 hours!`,
          type: 'DEADLINE_REMINDER',
        });
      }
    }
  }
}
