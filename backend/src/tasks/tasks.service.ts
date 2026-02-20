import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Task } from './schemas/task.schema';

export class TasksService {
  constructor(
    @InjectModel('Task') public taskModel: Model<Task>,
    @InjectModel('User') public userModel: Model<User>,
  ) {}

  async createTask(userId: string, title: string, description: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');
    const task = new this.taskModel({ title, description, user: user._id });
    return task.save();
  }

  async getTasks(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');
    return this.taskModel.find({ user: user._id });
  }

  async updateTask(taskId: string, title: string, description: string) {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new Error('Task not found');
    task.title = title;
    task.description = description;
    return task.save();
  }

  async deleteTask(taskId: string) {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new Error('Task not found');
    return task.deleteOne();
  }
}

export default TasksService;
