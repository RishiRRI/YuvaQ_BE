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
import { ClientModule } from './client/client.module';
import { ExpertiseModule } from './expertise/expertise.module';

import { MeetingDetailModule } from './meeting-details/meeting-details.module';
import { ChatModule } from './chat/chat.module';

import { PaymentsModule } from './payment/payment.module';

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
    ClientModule,
    ExpertiseModule,

    MeetingDetailModule,
    ChatModule,

    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
