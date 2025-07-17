import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { QualificationModule } from './consultant/qualification/qualification.module';
import { PreviousExperienceModule } from './consultant/previous-experience/previous-experience.module';
import { ConsultantDetailModule } from './consultant/consultant-details/consultant-details.module';
import { ConsultantModule } from './consultant/consultant.module';
import { MailModule } from './mail/mail.module';
import { ClientModule } from './client/client.module';
import { ExpertiseModule } from './expertise/expertise.module';
import { ChatHistoryModule } from './chat-history/chat-history.module';
import { GoogleModule } from './google-meet/google/google.module';
import { MeetModule } from './google-meet/meet/meet.module';
import { MeetingDetailModule } from './meeting-details/meeting-details.module';
import { MediatorModule } from './mediator/mediator.module';
import { ChatModule } from './chat/chat.module';
import { PhoneOtpModule } from './whatsapp/phone-otp/phone-otp.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { PaymentsModule } from './payment/payment.module';
import { ZoomModule } from './zoom/zoom.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.MONGODB!, {
      connectionName: 'Yuva',
    }),
    AuthModule,
    ConsultantModule,
    QualificationModule,
    PreviousExperienceModule,
    ConsultantDetailModule,
    MailModule,
    ClientModule,
    ExpertiseModule,
    ChatHistoryModule,
    GoogleModule,
    MeetModule,
    MeetingDetailModule,
    MediatorModule,
    ChatModule,
    WhatsAppModule,
    PhoneOtpModule,
    PaymentsModule,
    ZoomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
