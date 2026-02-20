import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dtos/tasks.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(@Query('userId') userId: string) {
    return this.tasksService.getTasks(userId);
  }

  @Get(':id')
  getTask(@Param('id') taskId: string) {
    return this.tasksService.taskModel.findById(taskId);
  }

  @Post()
  create(@Query('userId') userId: string, @Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(
      userId,
      dto.title,
      dto.description || '',
    );
  }

  @Put(':id')
  update(@Param('id') taskId: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.updateTask(
      taskId,
      dto.title || '',
      dto.description || '',
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
