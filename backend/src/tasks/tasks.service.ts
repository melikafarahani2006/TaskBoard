import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dtos/tasks.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) { }

  async createBulkTasks(userId: string, tasks: CreateTaskDto[]): Promise<TaskDocument[]> {
    try {
      const taskDocuments = tasks.map(task => ({
        userId: userId,
        title: task.title,
        description: task.description,
      }));

      return await this.taskModel.insertMany(taskDocuments);
    } catch (error) {
      throw new BadRequestException('Failed to create tasks');
    }
  }

  async getTasks(userId: string): Promise<TaskDocument[]> {
    try {
      console.log('Searching for tasks with userId:', userId);
      const tasks = await this.taskModel
        .find({
          userId: userId,
          isDeleted: false,
        } as any)
        .sort({ createdAt: -1 })
        .exec();
      console.log('Found tasks:', tasks.length);
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new BadRequestException('Failed to fetch tasks');
    }
  }

  async updateTask(
    taskId: string,
    userId: string,
    updateData: Partial<CreateTaskDto>,
  ): Promise<TaskDocument | null> {
    try {
      const task = await this.taskModel.findOneAndUpdate(
        {
          _id: taskId,
          userId: userId,
          isDeleted: false,
        } as any,
        updateData,
        { new: true },
      ).exec();

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update task');
    }
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    try {
      const task = await this.taskModel.findOneAndUpdate(
        {
          _id: taskId,
          userId: userId,
          isDeleted: false,
        } as any,
        { isDeleted: true },
        { new: true },
      ).exec();

      if (!task) {
        throw new NotFoundException('Task not found');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete task');
    }
  }
}