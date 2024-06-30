import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToShoppingCartDto {
  @ApiProperty({ example: 'Ivan' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsOptional()
  userId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  partId: number;
}
