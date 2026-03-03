import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from 'src/users/schemas/user.schema';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: Role, default: Role.USER })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
