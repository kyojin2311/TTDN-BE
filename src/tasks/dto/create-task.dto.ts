import { IsEnum, IsNotEmpty, IsString, IsOptional, IsArray, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../schemas/task.schema';

export class CreateTaskDto {
  @ApiProperty({ enum: TaskStatus, default: TaskStatus.DOING })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deadline: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  labels?: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
}
