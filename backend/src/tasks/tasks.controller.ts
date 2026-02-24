import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/tasks.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // async createTask(@Req() req: any, @Body() createTaskDto: CreateTaskDto) {
  //   const task = await this.tasksService.createTask(req.user.id, createTaskDto);
  //   return { message: 'Task created successfully', data: task };
  // }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  async createBulkTasks(@Req() req: any, @Body() body: { tasks: CreateTaskDto[] }) {
    const tasks = await this.tasksService.createBulkTasks(req.user.id, body.tasks);
    return { message: `${tasks.length} tasks created successfully`, data: tasks };
  }

  @Get()
  async getTasks(@Req() req: any) {
    console.log('Fetching tasks for user:', req.user.id);
    return await this.tasksService.getTasks(req.user.id);
  }

  @Patch(':id')
  async updateTask(
    @Param('id') taskId: string,
    @Req() req: any,
    @Body() updateTaskDto: Partial<CreateTaskDto>,
  ) {
    const task = await this.tasksService.updateTask(
      taskId,
      req.user.id,
      updateTaskDto,
    );
    return { message: 'Task updated successfully', data: task };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@Param('id') taskId: string, @Req() req: any) {
    await this.tasksService.deleteTask(taskId, req.user.id);
  }
}