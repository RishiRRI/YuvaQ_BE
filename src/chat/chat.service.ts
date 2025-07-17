import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatThreadForMediator } from './entities/chat-thread-for-mediator.entity';
import { ChatMessageForMediator } from './entities/chat-message-for-mediator.entity';
import { ChatThreadForConsultant } from './entities/chat-thread-for-consultant.entity';
import { ChatMessageForConsultant } from './entities/chat-message-for-consultant.entity';
import * as AWS from 'aws-sdk'; 


@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatThreadForMediator.name, 'Yuva')
    private readonly mediatorModel: Model<ChatThreadForMediator>,
    @InjectModel(ChatThreadForConsultant.name, 'Yuva')
    private readonly consultantModel: Model<ChatThreadForConsultant>,
  ) {}

  private async getThreadForMediator(mediator: string, client: string) {
    const thread =
      (await this.mediatorModel.findOne({ mediatorId: mediator, clientId: client })) ||
      (await new this.mediatorModel({ mediatorId: mediator, clientId: client }).save());
    return thread;
  }

  async sendMessageForMediator(
    mediatorId: string,
    clientId: string,
    sender: 'mediator' | 'client',
    body: string,
  ) {
    const thread = await this.getThreadForMediator(mediatorId, clientId);

    const msg: ChatMessageForMediator = { sender, body, sentAt: new Date() } as any;
    await this.mediatorModel.updateOne(
      { _id: thread._id },
      { $push: { messages: msg } },
    );
    return msg;
  }

  async getMessagesForMediator(
    mediatorId: string,
    clientId: string,
    limit = 30,
    skip = 0,
  ) {
    const thread = await this.mediatorModel
      .findOne(
        { mediatorId, clientId },
        { messages: { $slice: [-limit - skip, limit] } },
      )
      .lean();
    if (!thread) throw new NotFoundException('Thread not found');
    return thread.messages.reverse(); 
  }





  
  private async getThreadForConsultant(consultant: string, client: string) {
    const thread =
      (await this.consultantModel.findOne({ consultantId: consultant, clientId: client })) ||
      (await new this.consultantModel({ consultantId: consultant, clientId: client }).save());
    return thread;
  }

    async sendMessageForConsultant(
    consultantId: string,
    clientId: string,
    sender: 'consultant' | 'client',
    body: string,
    image?: Express.Multer.File, 
  ) {
    const thread = await this.getThreadForConsultant(consultantId, clientId);

    let msg: ChatMessageForConsultant = { sender, body, sentAt: new Date() } as any;

    if (image) {
      const s3 = new AWS.S3({
        endpoint: new AWS.Endpoint(`http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`),
        accessKeyId: process.env.MINIO_ACCESS_KEY,
        secretAccessKey: process.env.MINIO_SECRET_KEY,
        region: 'us-east-1', 
        s3ForcePathStyle: true,
      });

      if (!process.env.MINIO_BUCKET) {
        throw new Error('MINIO_BUCKET environment variable is not set');
      }
      const params = {
        Bucket: process.env.MINIO_BUCKET as string,
        Key: `consultantChats/${Date.now()}-${Math.round(Math.random() * 1e9)}.${image.originalname.split('.').pop()}`,
        Body: image.buffer,
        ContentType: image.mimetype,
        ACL: 'public-read',
      };

      const uploadResult = await s3.upload(params).promise();

      msg = { ...msg, imageUrl: uploadResult.Location }; 
    }

    await this.consultantModel.updateOne(
      { _id: thread._id },
      { $push: { messages: msg } },
    );
    return msg;
  }


  async getMessagesForConsultant(
    consultantId: string,
    clientId: string,
    limit = 30,
    skip = 0,
  ) {
    const thread = await this.consultantModel
      .findOne(
        { consultantId, clientId },
        { messages: { $slice: [-limit - skip, limit] } },
      )
      .lean();
    if (!thread) throw new NotFoundException('Thread not found');
    return thread.messages.reverse();
  }
}
