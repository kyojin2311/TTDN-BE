import { IsNotEmpty, IsString, IsHexColor } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLabelDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsHexColor()
  @IsNotEmpty()
  color: string;
}
