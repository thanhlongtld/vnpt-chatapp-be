import { IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @IsNotEmpty({ message: 'Invalid refresh token' })
  refreshToken: string;
}
