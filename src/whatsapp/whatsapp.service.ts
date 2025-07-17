import { Injectable } from '@nestjs/common';
import axios from 'axios'; 

@Injectable()
export class WhatsAppService {
  private readonly WHATSAPP_API_URL = 'https://graph.facebook.com/v13.0/';
  private readonly PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
  private readonly ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

  async sendOtp(phoneNumber: string, otp: string): Promise<void> {
    const message = `${otp} is your verification code. For your security, do not share this code. This code expires in 5 minutes.`;
    
    const url = `${this.WHATSAPP_API_URL}${this.PHONE_NUMBER_ID}/messages`;
    
    const data = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      text: { body: message },
    };

    try {
      await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${this.ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error sending OTP to WhatsApp:', error);
      throw new Error('Failed to send OTP via WhatsApp.');
    }
  }
}
