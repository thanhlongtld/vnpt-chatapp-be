import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dtos/login.dto';
import { TokenPair } from './types/token-pair';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(ConfigService) private configService: ConfigService,

    private usersService: UsersService,
  ) {}

  generateAccessToken(user: User): string {
    return this.jwtService.sign(
      {
        username: user.username,
        id: user.id,
      },
      {
        secret: this.configService.get('auth').accessTokenSecret,
        expiresIn: '30m',
      },
    );
  }

  generateRefreshToken(user: User): string {
    return this.jwtService.sign(
      {
        username: user.username,
        id: user.id,
      },
      {
        secret: this.configService.get('auth').refreshTokenSecret,
        expiresIn: '1d',
      },
    );
  }

  decodeToken(token: string): User {
    try {
      this.jwtService.verify(token, {
        secret: this.configService.get('auth').refreshTokenSecret,
      });

      return this.jwtService.decode(token) as User;
    } catch (error) {
      throw new UnauthorizedException('Token invalid');
    }
  }

  async validateUser(credentials: LoginDto): Promise<User> {
    const user = await this.usersService.findByUsername(
      credentials.username,
      true,
    );

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const isPasswordMatching = await bcrypt.compare(
      credentials.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new HttpException('Password incorrect', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  async login(user: User): Promise<TokenPair> {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(credentials: RegisterDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    const newUser = await this.usersService.create({
      ...credentials,
      password: hashedPassword,
    });

    delete newUser.password;

    return newUser;
  }
}
