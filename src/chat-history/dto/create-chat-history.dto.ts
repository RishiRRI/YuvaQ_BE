import { IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ChatMessage } from '../entities/chat-message.entity';

export class CreateChatHistoryDto {
  @IsString() clientId: string;
  @IsString() clientName: string;
  @IsString() consultantId: string;
  @IsString() consultantName: string;
  @IsString() businessArea: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessage)
  @IsOptional()
  messages?: ChatMessage[];
}
