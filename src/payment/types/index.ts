import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponse {
  @ApiProperty({ example: '2e13619c-000f-5000' })
  id: string;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiProperty({ example: { value: '100.00', currency: 'RUB' } })
  amount: {
    value: string;
    currency: string;
  };

  @ApiProperty({ example: 'Оплата №1' })
  description: string;

  @ApiProperty({ example: { account_id: '403999', gateway_id: '2262906' } })
  recipient: {
    account_id: string;
    gateway_id: string;
  };

  @ApiProperty({ example: '2024-06-30T12:21:49.001Z' })
  created_at: string;

  @ApiProperty({
    example: {
      type: 'redirect',
      confirmation_url: 'https://yoomoney.ru/checkout/payments/',
    },
  })
  confirmation: {
    type: string;
    confirmation_url: string;
  };

  @ApiProperty({ example: true })
  test: boolean;

  @ApiProperty({ example: false })
  paid: boolean;

  @ApiProperty({ example: false })
  refundable: boolean;

  @ApiProperty({ example: {} })
  metadata: {};
}
