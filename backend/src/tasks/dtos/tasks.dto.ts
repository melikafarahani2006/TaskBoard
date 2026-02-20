import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    required: true,
    description: 'The title of the task',
    example: 'Buy groceries',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The description of the task',
    example: 'Milk, Bread, Eggs, and Butter',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'The title of the task',
    example: 'Buy groceries',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'The description of the task',
    example: 'Milk, Bread, Eggs, and Butter',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
