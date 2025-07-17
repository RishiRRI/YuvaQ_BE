import { IsString } from 'class-validator';

export class AddMessageDto {
  @IsString() text: string;
  @IsString() sender: 'client' | 'consultant';
}
