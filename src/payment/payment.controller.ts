import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { MakePaymentDto } from './dto/make-payment.dto';
import { PaymentService } from './payment.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { PaymentResponse } from './types';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOkResponse({ type: PaymentResponse })
  @UseGuards(AuthenticatedGuard)
  @Post()
  makePayment(@Body() makePaymentDto: MakePaymentDto) {
    return this.paymentService.makePayment(makePaymentDto);
  }
}
