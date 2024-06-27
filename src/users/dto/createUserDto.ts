import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Ivan' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'ivan123@gmail.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'ivan123' })
  @IsNotEmpty()
  password: string;
}
