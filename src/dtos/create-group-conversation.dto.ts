import { ArrayNotEmpty, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateGroupConversationDto {
  @IsNumber({}, { each: true })
  @ArrayNotEmpty()
  memberIds: number[];

  @IsNotEmpty()
  name: string;
}
