// // src/chat/chat.controller.ts
// import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
// import { ChatService } from './chat.service';

// @Controller('/api/chat')
// export class ChatController {
//   constructor(private readonly chat: ChatService) {}

//   @Post(':mediatorId/:clientId')
//   send(
//     @Param('mediatorId') mediatorId: string,
//     @Param('clientId') clientId: string,
//     @Body() body: { sender: 'mediator' | 'client'; message: string },
//   ) {
//     return this.chat.sendMessage(
//       mediatorId,
//       clientId,
//       body.sender,
//       body.message,
//     );
//   }

//   @Get(':mediatorId/:clientId')
//   history(
//     @Param('mediatorId') mediatorId: string,
//     @Param('clientId') clientId: string,
//     @Query('limit') limit = 30,
//     @Query('skip') skip = 0,
//   ) {
//     return this.chat.getMessages(mediatorId, clientId, +limit, +skip);
//   }
// }
