import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './schemas/task.schema';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'The task has been successfully created.', type: Task })
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    console.log('API called: POST /tasks');
    return this.tasksService.create(createTaskDto, req.user.uid);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks.', type: [Task] })
  findAll(@Request() req) {
    console.log('API called: GET /tasks');
    return this.tasksService.findAll(req.user.uid);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by id' })
  @ApiResponse({ status: 200, description: 'Return the task.', type: Task })
  findOne(@Param('id') id: string, @Request() req) {
    console.log(`API called: GET /tasks/${id}`);
    return this.tasksService.findOne(id, req.user.uid);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'The task has been successfully updated.', type: Task })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() req) {
    console.log(`API called: PATCH /tasks/${id}`);
    return this.tasksService.update(id, updateTaskDto, req.user.uid);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'The task has been successfully deleted.' })
  remove(@Param('id') id: string, @Request() req) {
    console.log(`API called: DELETE /tasks/${id}`);
    return this.tasksService.remove(id, req.user.uid);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update task status' })
  updateStatus(@Param('id') id: string, @Body('status') status: string, @Request() req) {
    console.log(`API called: PATCH /tasks/${id}/status`);
    return this.tasksService.updateStatus(id, status, req.user.uid);
  }
}
