import { ForbiddenException, Injectable } from '@nestjs/common';
import { MakePaymentDto } from './dto/make-payment.dto';
import axios from 'axios';


@Injectable()
export class PaymentService {
  async makePayment(makePaymentDto: MakePaymentDto) {
    try {
      const { data } = await axios({
        method: 'POST',
        url: 'https://api.yookassa.ru/v3/payments',
        headers: {
          'Content-Type': 'application/json',
          'Idempotence-Key': Date.now(),
        },

        auth: {
          username: '403999',
          password: 'test_xQgMM5K6Qfsq1brvHhVL1h8y62wxQudgxmylQJ6tA-Y',
        },

        data: {
          amount: {
            value: makePaymentDto.amount,
            currency: 'RUB',
          },

          confirmation: {
            type: 'redirect',
            return_url: 'http://localhost:3001/order',
          },

          capture: true,
          description: 'ОПЛата №3',
        },
      });

      return data;
    } catch (e) {
      throw new ForbiddenException(e);
    }
  }
}
