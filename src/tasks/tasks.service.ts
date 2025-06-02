import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument, TaskStatus } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const deadline = new Date(createTaskDto.deadline);
    deadline.setHours(23, 59, 59, 999);
    const { labels, ...rest } = createTaskDto;
    const createdTask = new this.taskModel({
      ...rest,
      deadline,
      userId,
      labels: labels || [],
    });
    return createdTask.save();
  }

  async findAll(userId: string): Promise<Task[]> {
    return this.taskModel.find({ userId }).populate('labels').exec();
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.taskModel.findOne({ _id: id, userId }).populate('labels').exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    if (updateTaskDto.deadline) {
      const deadline = new Date(updateTaskDto.deadline);
      deadline.setHours(23, 59, 59, 999);
      updateTaskDto.deadline = deadline.toISOString();
    }
    const { labels, ...rest } = updateTaskDto;
    const updatedTask = await this.taskModel
      .findOneAndUpdate({ _id: id, userId }, { ...rest, labels: labels || [] }, { new: true })
      .populate('labels')
      .exec();
    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return updatedTask;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.taskModel.deleteOne({ _id: id, userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async updateStatus(id: string, status: string, userId: string): Promise<Task> {
    const updatedTask = await this.taskModel
      .findOneAndUpdate({ _id: id, userId }, { status }, { new: true })
      .populate('labels')
      .exec();
    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return updatedTask;
  }

  async findTasksWithDeadline(deadline: Date): Promise<TaskDocument[]> {
    return this.taskModel
      .find({
        deadline: { $lte: deadline },
        status: { $ne: TaskStatus.DONE },
      })
      .exec();
  }
}
