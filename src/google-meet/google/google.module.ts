// src/google/google.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { GoogleOAuthService } from './google-oauth.service';
import { GoogleController } from './google.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [forwardRef(() => AuthModule)], 
  providers: [GoogleOAuthService],
  controllers: [GoogleController],
  exports: [GoogleOAuthService],
})
export class GoogleModule {}