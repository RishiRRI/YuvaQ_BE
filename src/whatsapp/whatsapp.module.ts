import { Module } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { PhoneOtpModule } from './phone-otp/phone-otp.module';


@Module({
  // controllers: [WhatsappController],
  providers: [WhatsAppService],
  exports: [WhatsAppService],
  imports: [PhoneOtpModule],
})
export class WhatsAppModule {}
