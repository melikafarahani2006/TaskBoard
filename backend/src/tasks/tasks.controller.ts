import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dtos/tasks.dto';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getTasks(@Req() req: any) {
    return this.tasksService.getTasks(req.user.sub);
  }

  @Get(':id')
  getTask(@Param('id') taskId: string) {
    return this.tasksService.taskModel.findById(taskId);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(
      req.user.sub,
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
