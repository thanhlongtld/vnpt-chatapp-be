import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Please input your username' })
  @MaxLength(15, { message: 'Username must be less than 15 characters' })
  @MinLength(6, { message: 'Username must be more than 6 characters' })
  username: string;

  @IsNotEmpty({ message: 'Please input your password' })
  @MaxLength(15, { message: 'Password must be less than 15 characters' })
  @MinLength(8, { message: 'Password must be more than 8 characters' })
  password: string;
}
