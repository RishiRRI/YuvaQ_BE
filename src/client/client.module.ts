import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';

import { Client, ClientSchema } from './entities/client.entity';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { ConsultantModule } from 'src/consultant/consultant.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Client.name, schema: ClientSchema }],
      'Yuva',
    ),

    MulterModule.registerAsync({
      useFactory: () => {
        const s3 = new S3Client({
          region: 'us-east-1',
          endpoint: `http${process.env.MINIO_USE_SSL === 'true' ? 's' : ''}://${
            process.env.MINIO_ENDPOINT
          }:${process.env.MINIO_PORT}`,
          credentials: {
            accessKeyId: process.env.MINIO_ACCESS_KEY ?? '',
            secretAccessKey: process.env.MINIO_SECRET_KEY ?? '',
          },
          forcePathStyle: true,
        });

        return {
          storage: multerS3({
            s3,
            bucket: process.env.MINIO_BUCKET ?? '',
            acl: 'public-read',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (_req, file, cb) => {
              const ext = file.originalname.split('.').pop();
              const key = `clients/${Date.now()}-${Math.round(
                Math.random() * 1e9,
              )}.${ext}`;
              cb(null, key);
            },
          }),
        };
      },
    }),
    ConsultantModule,
  ],
  providers: [ClientService],
  controllers: [ClientController],
})
export class ClientModule {}
