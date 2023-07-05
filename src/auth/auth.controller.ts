import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { TokenPair } from './types/token-pair';
import { RegisterDto } from './dtos/register.dto';
import { User } from 'src/users/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { RefreshDto } from './dtos/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Body() loginDto: LoginDto): Promise<TokenPair> {
    return await this.authService.login(req.user);
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return await this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Request() req): Promise<User> {
    return await this.usersService.findById(req.user.id);
  }

  @Post('/refresh')
  async refresh(
    @Request() req,
    @Body() refreshData: RefreshDto,
  ): Promise<TokenPair> {
    const user = this.authService.decodeToken(refreshData.refreshToken);

    return await this.authService.login(user);
  }
}
