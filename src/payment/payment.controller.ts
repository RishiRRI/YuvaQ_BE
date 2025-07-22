import { Controller, Post, Body, Headers, Req, Res, Get } from '@nestjs/common';
import { Request, Response } from 'express';
import { PaymentsService } from './payment.service';

@Controller('/api/payments')
export class PaymentsController {
  constructor(private readonly pay: PaymentsService) {}

  @Post('create-order')
  create(@Body('amount') amount: number) {
    return this.pay.createOrder(amount);
  }

  @Post('webhook')
  async webhook(
    @Headers('x-razorpay-signature') sig: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      console.log('Reached to Razorpay Webhook controller ');

      await this.pay.handleWebhook(sig, req.body as Buffer);
      res.json({ status: 'ok' });
    } catch (e) {
      console.error('Webhook error:', e);
      res.status(400).json({ error: (e as Error).message });
    }
  }

  @Get()
  list() {
    return this.pay.findAll();
  }
}
