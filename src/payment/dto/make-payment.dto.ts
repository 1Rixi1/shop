import { ApiProperty } from '@nestjs/swagger';

export class MakePaymentDto {
  @ApiProperty({ example: 1000 })
  amount: number;
}
