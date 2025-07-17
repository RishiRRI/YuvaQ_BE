import Razorpay from 'razorpay';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './entities/payment.entity';
import { Model } from 'mongoose';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private razor: Razorpay;

  constructor(
    @InjectModel(Payment.name, 'Yuva')
    private payModel: Model<Payment>,
  ) {
    this.razor = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(amountInRupee: number) {
    const order = await this.razor.orders.create({
      amount:   amountInRupee * 100,   
      currency: 'INR',
      receipt:  `rcpt_${Date.now()}`,
    });
    return order;                      
  }

async handleWebhook(sig: string, raw: Buffer) {
  console.log('→ Razorpay webhook hit. Signature hdr =', sig);
  console.log('Raw body length:', raw.length); // Add this
  console.log('Raw body type:', typeof raw); // Add this

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  if (!secret) { // Add this check
    console.error('RAZORPAY_WEBHOOK_SECRET is not set!');
    throw new Error('Webhook secret not configured');
  }

  const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');

  console.log('🔑 expected HMAC =', expected);

  if (sig !== expected) {
    console.warn('❌ signature mismatch – webhook ignored');
    console.warn('Received signature:', sig); // Add this
    console.warn('Expected signature:', expected); // Add this
    throw new Error('Invalid webhook signature');
  }

  console.log('✅ Signature verified.'); // Add this

  const body = JSON.parse(raw.toString());
  console.log('📦 event =', body.event);

  if (body.event !== 'payment.captured') {
    console.log('Skipping event, not payment.captured'); // Add this
    return;
  }

  const p = body.payload.payment.entity;
  console.log('💰 captured', p.amount, p.currency, 'id=', p.id);
  console.log('Payment details:', p); // Add this for full payload

  await this.payModel.create({
    orderId: p.order_id,
    paymentId: p.id,
    amount: p.amount / 100,
    currency: p.currency,
    status: p.status,
    method: p.method,
    email: p.email,
    contact: p.contact,
  });
  console.log('✅ payment saved to DB');
}


  findAll() { return this.payModel.find().sort({ createdAt: -1 }); }
}
