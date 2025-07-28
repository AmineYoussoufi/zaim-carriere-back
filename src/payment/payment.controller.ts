import { Controller, Get, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('upcoming/checks')
  async getUpcomingChecks(@Query('date') date?: string) {
    return this.paymentService.getUpcomingChecks(date);
  }

  @Get('upcoming/lcns')
  async getUpcomingLCNs(@Query('date') date?: string) {
    return this.paymentService.getUpcomingLCNs(date);
  }

  @Get('upcoming')
  async getUpcomingPayments(@Query('date') date?: string) {
    return this.paymentService.getUpcomingPayments(date);
  }
}
