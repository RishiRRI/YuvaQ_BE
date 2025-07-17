import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ZoomController } from './zoom.controller';
import { ZoomService } from './zoom.service';


@Module({
  imports: [ConfigModule],
  providers: [ZoomService],
  controllers: [ZoomController],
  exports: [ZoomService],
})
export class ZoomModule {}
