import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateChatDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;
}

export class AddMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(8000)
  content: string;
}

export class RenameChatDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;
}